"""
Comprehensive automated test suite for ZEROBUGS HRM-05 Phase 2.
Tests dataset validation, database initialization, relationships,
repository functions, demo personas, and HTTP endpoints.
"""

import unittest
import json
import urllib.request
import urllib.error
from pathlib import Path

from backend.app.config import settings
from backend.app.database.database import SessionLocal
from backend.app.database.validate_data import validate_synthetic_dataset
from backend.app.database.init_db import init_database
from backend.app.database.verify_db import verify_database
from backend.app.database.repository import EmployeeRepository
from backend.app.models import Employee, Role, Skill


class TestPhase2BackendCore(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Ensure database is initialized before running tests."""
        cls.db = SessionLocal()

    @classmethod
    def tearDownClass(cls):
        cls.db.close()

    # 1. Dataset Validation Test
    def test_01_dataset_validation(self):
        valid, report = validate_synthetic_dataset(settings.SYNTHETIC_DATA_PATH)
        self.assertTrue(valid, "Synthetic dataset validation should pass.")
        self.assertEqual(report["demo_statuses"]["Elena"], "PASS")
        self.assertEqual(report["demo_statuses"]["Marcus"], "PASS")
        self.assertEqual(report["demo_statuses"]["Priya"], "PASS")

    # 2. Database Verification Test
    def test_02_database_verification(self):
        verified = verify_database()
        self.assertTrue(verified, "Database verification should pass.")

    # 3. Idempotency Test
    def test_03_database_init_idempotency(self):
        # Run initialization again
        success = init_database(settings.SYNTHETIC_DATA_PATH)
        self.assertTrue(success, "Second init_database call must succeed.")
        count = self.db.query(Employee).count()
        self.assertEqual(count, 30, "Employee count must remain exactly 30 after second init.")

    # 4. Employee Retrieval Test
    def test_04_get_all_employees(self):
        employees = EmployeeRepository.get_all_employees(self.db)
        self.assertEqual(len(employees), 30, "Should retrieve exactly 30 employees.")
        first = employees[0]
        self.assertTrue(hasattr(first, "employee_id"))
        self.assertTrue(hasattr(first, "current_role"))

    # 5. Demo Persona A: Elena Rostova (EMP001) - Strong Performer
    def test_05_demo_elena_rostova(self):
        elena = EmployeeRepository.get_employee_by_id(self.db, "EMP001")
        self.assertIsNotNone(elena)
        self.assertEqual(elena.name, "Elena Rostova")
        self.assertEqual(elena.current_role_id, "ROLE_SR_SWE")
        self.assertEqual(elena.target_role_id, "ROLE_TECH_LEAD")

        # Goals (94-98% progress)
        goals = EmployeeRepository.get_employee_goals(self.db, "EMP001")
        self.assertGreaterEqual(len(goals), 2)
        avg_goal = sum(g.progress_pct for g in goals) / len(goals)
        self.assertGreaterEqual(avg_goal, 90.0)

        # Manager Evaluation (Strong: 4.8)
        evals = EmployeeRepository.get_employee_manager_evaluations(self.db, "EMP001")
        self.assertGreaterEqual(len(evals), 1)
        self.assertGreaterEqual(evals[0].rating, 4.5)

        # Business Impact
        impacts = EmployeeRepository.get_employee_business_impact(self.db, "EMP001")
        self.assertGreaterEqual(len(impacts), 1)

    # 6. Demo Persona B: Marcus Chen (EMP002) - Skill Gaps
    def test_06_demo_marcus_chen(self):
        marcus = EmployeeRepository.get_employee_by_id(self.db, "EMP002")
        self.assertIsNotNone(marcus)
        self.assertEqual(marcus.name, "Marcus Chen")
        self.assertEqual(marcus.target_role_id, "ROLE_SR_DE")

        # Skill Gaps: Distributed Systems <= 2, Kubernetes <= 2
        skills = EmployeeRepository.get_employee_skills(self.db, "EMP002")
        skill_map = {es.skill_id: es.proficiency_level for es in skills}
        self.assertIn("SKILL_DIST_SYS", skill_map)
        self.assertIn("SKILL_K8S", skill_map)
        self.assertLessEqual(skill_map["SKILL_DIST_SYS"], 2, "Marcus must have gap in Distributed Systems.")
        self.assertLessEqual(skill_map["SKILL_K8S"], 2, "Marcus must have gap in Kubernetes.")

    # 7. Demo Persona C: Priya Sharma (EMP003) - Evaluation Inconsistency
    def test_07_demo_priya_sharma(self):
        priya = EmployeeRepository.get_employee_by_id(self.db, "EMP003")
        self.assertIsNotNone(priya)
        self.assertEqual(priya.name, "Priya Sharma")

        # Peer Feedback (Average >= 4.7)
        fb = EmployeeRepository.get_employee_feedback(self.db, "EMP003")
        self.assertGreaterEqual(len(fb), 2)
        avg_fb = sum(f.rating for f in fb) / len(fb)
        self.assertGreaterEqual(avg_fb, 4.7)

        # Manager Rating (Significantly lower: <= 3.0)
        evals = EmployeeRepository.get_employee_manager_evaluations(self.db, "EMP003")
        self.assertGreaterEqual(len(evals), 1)
        self.assertLessEqual(evals[0].rating, 3.0, "Priya manager evaluation must reflect calibration discrepancy.")

    # 8. Aggregated Evidence Package Test
    def test_08_get_employee_evidence(self):
        evidence_pkg = EmployeeRepository.get_employee_evidence(self.db, "EMP001")
        self.assertIsNotNone(evidence_pkg)
        ev = evidence_pkg["evidence"]
        self.assertIn("goals", ev)
        self.assertIn("projects", ev)
        self.assertIn("feedback", ev)
        self.assertIn("skills", ev)
        self.assertIn("training", ev)
        self.assertIn("attendance", ev)
        self.assertIn("business_impact", ev)
        self.assertIn("manager_evaluations", ev)

    # 9. Missing Employee Handling Test
    def test_09_missing_employee(self):
        emp = EmployeeRepository.get_employee_by_id(self.db, "EMP_DOES_NOT_EXIST")
        self.assertIsNone(emp)
        evidence = EmployeeRepository.get_employee_evidence(self.db, "EMP_DOES_NOT_EXIST")
        self.assertIsNone(evidence)

    # 10. HTTP Endpoints Verification Test
    def test_10_http_api_endpoints(self):
        base_url = "http://127.0.0.1:8000"

        # Health
        req = urllib.request.Request(f"{base_url}/api/health")
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertEqual(data["status"], "healthy")
            self.assertEqual(data["employee_count"], 30)

        # Employees list
        req = urllib.request.Request(f"{base_url}/api/employees")
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertEqual(len(data), 30)

        # Elena single & sub-resources
        for sub in ["", "/evidence", "/goals", "/projects", "/feedback", "/skills", "/training", "/attendance", "/business-impact", "/manager-evaluations"]:
            url = f"{base_url}/api/employees/EMP001{sub}"
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req) as resp:
                self.assertEqual(resp.status, 200, f"Endpoint {url} must return 200")

        # 404 test on invalid employee
        bad_url = f"{base_url}/api/employees/EMP_INVALID"
        try:
            urllib.request.urlopen(bad_url)
            self.fail("Should raise HTTPError for invalid employee")
        except urllib.error.HTTPError as e:
            self.assertEqual(e.code, 404)


if __name__ == "__main__":
    unittest.main()
