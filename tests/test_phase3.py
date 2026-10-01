"""
ZEROBUGS HRM-05: Phase 3 Test Suite
Comprehensive testing for Explainable Analytics Engine:
- Performance Evaluation (5 components + composite)
- Skill Gap Detection (Mandatory, Moderate, Met)
- Career Pathway Roadmap (Milestones, Actions)
- Promotion Readiness (4 dimensions, 3 readiness tiers)
- Manager Calibration (Variance, Neutral Inconsistency Flag)
- Offline AI Reasoning (Template-based, no fabricated evidence, no API key required)
- Master Orchestrator & Persistence
- Demo Personas (Elena, Marcus, Priya)
- Edge Cases & Resiliency
- Live HTTP API Endpoints
"""

import unittest
import json
import urllib.request
import urllib.error
from typing import Dict, Any

from backend.app.database.database import SessionLocal
from backend.app.database.repository import EmployeeRepository
from backend.app.models import (
    Employee,
    Goal,
    Project,
    Feedback,
    Attendance,
    BusinessImpact,
    ManagerEvaluation,
    AnalysisResult
)
from backend.app.services.performance_service import (
    PerformanceService,
    WEIGHT_GOALS,
    WEIGHT_PROJECTS,
    WEIGHT_FEEDBACK,
    WEIGHT_RELIABILITY,
    WEIGHT_BUSINESS_IMPACT
)
from backend.app.services.skill_gap_service import SkillGapService
from backend.app.services.career_service import CareerService
from backend.app.services.promotion_service import (
    PromotionService,
    READY_NOW_PERFORMANCE_MIN,
    DEVELOPING_PERFORMANCE_MIN
)
from backend.app.services.calibration_service import (
    CalibrationService,
    VARIANCE_THRESHOLD
)
from backend.app.services.reasoning_service import ReasoningService
from backend.app.services.analysis_service import AnalysisOrchestrator


class TestPhase3AnalyticsEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.db = SessionLocal()
        cls.base_url = "http://127.0.0.1:8000"

    @classmethod
    def tearDownClass(cls):
        cls.db.close()

    # =========================================================================
    # 1. Performance Service Tests
    # =========================================================================
    def test_01_performance_weights_sum_to_one(self):
        """Weights must be transparent and sum exactly to 1.0 (100%)."""
        total_weight = (
            WEIGHT_GOALS +
            WEIGHT_PROJECTS +
            WEIGHT_FEEDBACK +
            WEIGHT_RELIABILITY +
            WEIGHT_BUSINESS_IMPACT
        )
        self.assertAlmostEqual(total_weight, 1.0, places=4)
        self.assertEqual(WEIGHT_GOALS, 0.30)
        self.assertEqual(WEIGHT_PROJECTS, 0.25)
        self.assertEqual(WEIGHT_FEEDBACK, 0.20)
        self.assertEqual(WEIGHT_RELIABILITY, 0.10)
        self.assertEqual(WEIGHT_BUSINESS_IMPACT, 0.15)

    def test_02_performance_goal_calculation(self):
        """Verify goal achievement calculation from actual DB records."""
        goals = EmployeeRepository.get_employee_goals(self.db, "EMP001")
        res = PerformanceService.analyze_goals(goals)
        self.assertIn("goal_score", res)
        self.assertIn("average_progress", res)
        self.assertGreaterEqual(res["goal_score"], 90.0)
        self.assertEqual(res["total_goals"], len(goals))
        self.assertGreaterEqual(res["completed_goals"], 1)

    def test_03_performance_project_non_technical_no_penalty(self):
        """Non-technical roles with null code_quality_score must not be penalized."""
        projects = EmployeeRepository.get_employee_projects(self.db, "EMP003")
        res = PerformanceService.analyze_projects(projects)
        self.assertEqual(res["average_code_quality"], None)
        self.assertEqual(res["on_time_rate_pct"], 100.0)
        self.assertEqual(res["project_score"], 100.0, "Should achieve 100% on-time delivery score without penalty.")

    def test_04_performance_composite_formula(self):
        """Composite score must adhere strictly to the documented formula."""
        perf = PerformanceService.get_employee_performance(self.db, "EMP001")
        self.assertIsNotNone(perf)
        comps = perf["components"]
        expected = round(
            comps["goal_score"] * 0.30 +
            comps["project_score"] * 0.25 +
            comps["feedback_score"] * 0.20 +
            comps["reliability_score"] * 0.10 +
            comps["business_impact_score"] * 0.15,
            2
        )
        self.assertEqual(perf["performance_score"], expected)

    # =========================================================================
    # 2. Skill Gap Service Tests
    # =========================================================================
    def test_05_skill_gap_elena_meets_all(self):
        """Elena Rostova should meet all requirements for Tech Lead with 0 critical gaps."""
        res = SkillGapService.get_employee_skill_gaps(self.db, "EMP001")
        self.assertIsNotNone(res)
        self.assertEqual(len(res["critical_gaps"]), 0, "Elena should have 0 critical gaps.")
        self.assertEqual(res["mandatory_met_pct"], 100.0)
        self.assertGreater(len(res["skills_meeting_requirements"]), 0)

    def test_06_skill_gap_marcus_chen_gaps(self):
        """Marcus Chen must naturally reveal Distributed Systems and Kubernetes gaps."""
        res = SkillGapService.get_employee_skill_gaps(self.db, "EMP002")
        self.assertIsNotNone(res)
        critical_names = [g["skill_name"] for g in res["critical_gaps"]]
        self.assertIn("Distributed Systems", critical_names)
        self.assertIn("Kubernetes", critical_names)
        # Verify gap sizes
        k8s_gap = next(g for g in res["critical_gaps"] if g["skill_name"] == "Kubernetes")
        self.assertEqual(k8s_gap["current_level"], 1)
        self.assertEqual(k8s_gap["required_level"], 3)
        self.assertEqual(k8s_gap["gap"], 2)
        self.assertTrue(k8s_gap["is_mandatory"])

    # =========================================================================
    # 3. Career Service Tests
    # =========================================================================
    def test_07_career_pathway_structure(self):
        """Career roadmap must produce milestones, actions, and non-authoritative disclaimer."""
        res = CareerService.get_employee_career_path(self.db, "EMP002")
        self.assertIsNotNone(res)
        self.assertEqual(res["current_role"]["name"], "Data Engineer")
        self.assertEqual(res["target_role"]["name"], "Senior Data Engineer")
        self.assertEqual(len(res["milestones"]), 4)
        self.assertGreater(len(res["recommended_development_actions"]), 0)
        self.assertIn("recommendation engine", res["disclaimer"].lower())

    def test_08_career_path_links_marcus_k8s_training(self):
        """Marcus's career actions should incorporate his in-progress Kubernetes training."""
        res = CareerService.get_employee_career_path(self.db, "EMP002")
        actions_str = json.dumps(res["recommended_development_actions"])
        self.assertIn("Kubernetes", actions_str)

    # =========================================================================
    # 4. Promotion Readiness Service Tests
    # =========================================================================
    def test_09_promotion_elena_ready_now(self):
        """Elena Rostova should be evaluated as 'Ready Now' based on evidence."""
        res = PromotionService.get_employee_promotion_readiness(self.db, "EMP001")
        self.assertIsNotNone(res)
        self.assertEqual(res["readiness_level"], "Ready Now")
        self.assertTrue(res["human_review_required"])
        self.assertIn("Final promotion decisions remain with HR and managers.", res["disclaimer"])

    def test_10_promotion_marcus_developing(self):
        """Marcus Chen should be evaluated as 'Developing - Ready in 6-12 Months' due to skill gaps."""
        res = PromotionService.get_employee_promotion_readiness(self.db, "EMP002")
        self.assertIsNotNone(res)
        self.assertEqual(res["readiness_level"], "Developing - Ready in 6-12 Months")
        self.assertGreaterEqual(len(res["missing_requirements"]), 2)

    # =========================================================================
    # 5. Manager Calibration Service Tests
    # =========================================================================
    def test_11_calibration_elena_aligned(self):
        """Elena's manager rating (4.8) should align closely with objective evidence (variance < 20)."""
        res = CalibrationService.get_employee_calibration(self.db, "EMP001")
        self.assertIsNotNone(res)
        self.assertFalse(res["flag"])
        self.assertFalse(res["review_recommended"])
        self.assertLess(abs(res["variance"]), VARIANCE_THRESHOLD)
        self.assertIn("aligned", res["message"].lower())

    def test_12_calibration_priya_inconsistency_flag(self):
        """Priya Sharma (EMP003) must naturally trigger the neutral inconsistency flag."""
        res = CalibrationService.get_employee_calibration(self.db, "EMP003")
        self.assertIsNotNone(res)
        self.assertEqual(res["manager_rating"], 2.8)
        self.assertEqual(res["manager_normalized_score"], 56.0)
        self.assertGreater(res["evidence_score"], 90.0)
        self.assertLess(res["variance"], -20.0)
        self.assertTrue(res["flag"])
        self.assertTrue(res["review_recommended"])
        self.assertEqual(res["message"], "Potential evaluation inconsistency detected.")
        # Neutral phrasing check: NO "bias" accusation
        self.assertNotIn("bias", res["message"].lower())
        self.assertNotIn("biased", res["message"].lower())

    def test_13_org_wide_calibration(self):
        """Org-wide calibration must process all 30 employees cleanly."""
        org_cal = CalibrationService.get_org_calibration(self.db)
        self.assertEqual(org_cal["total_evaluated"], 30)
        self.assertGreater(org_cal["flagged_count"], 0)
        self.assertGreater(org_cal["aligned_count"], 0)
        self.assertEqual(org_cal["flagged_count"] + org_cal["aligned_count"], 30)

    # =========================================================================
    # 6. AI Reasoning Service Tests
    # =========================================================================
    def test_14_offline_reasoning_generation(self):
        """Reasoning service must generate complete narrative offline without external API keys."""
        res = AnalysisOrchestrator.analyze_employee(self.db, "EMP001", persist=False)
        self.assertIsNotNone(res)
        explanation = res["explanation"]
        self.assertEqual(explanation["provider"], "offline")
        self.assertIn("Performance Summary", res["explanation_narrative"])
        self.assertIn("Key Strengths", res["explanation_narrative"])
        self.assertIn("Objective Evidence", res["explanation_narrative"])
        self.assertIn("Skill Assessment", res["explanation_narrative"])
        self.assertIn("Career Progression Roadmap", res["explanation_narrative"])
        self.assertIn("Promotion Readiness Determination", res["explanation_narrative"])
        self.assertIn("Manager Evaluation Calibration", res["explanation_narrative"])
        self.assertIn("Recommended Next Steps", res["explanation_narrative"])

    # =========================================================================
    # 7. Persistence & Orchestration Tests
    # =========================================================================
    def test_15_orchestrator_persistence_idempotency(self):
        """Orchestrator must persist into ANALYSIS_RESULTS and update idempotently."""
        res1 = AnalysisOrchestrator.analyze_employee(self.db, "EMP001", persist=True)
        self.assertIsNotNone(res1)
        count1 = self.db.query(AnalysisResult).filter(AnalysisResult.employee_id == "EMP001").count()
        self.assertEqual(count1, 1)

        # Run second time
        res2 = AnalysisOrchestrator.analyze_employee(self.db, "EMP001", persist=True)
        count2 = self.db.query(AnalysisResult).filter(AnalysisResult.employee_id == "EMP001").count()
        self.assertEqual(count2, 1, "Must not duplicate records for the same employee.")

        record = EmployeeRepository.get_analysis_result(self.db, "EMP001")
        self.assertIsNotNone(record)
        self.assertEqual(record.readiness_level, "Ready Now")
        # Ensure structured fields are JSON parsable
        strengths = json.loads(record.strengths)
        self.assertIsInstance(strengths, list)

    # =========================================================================
    # 8. Edge Cases & Resilience Tests
    # =========================================================================
    def test_16_edge_case_empty_evidence(self):
        """Evaluate edge case where employee has empty evidence without crashing."""
        perf = PerformanceService.evaluate_performance(
            employee_id="TEST_EMPTY",
            goals=[],
            projects=[],
            feedback=[],
            attendance=[],
            impacts=[]
        )
        self.assertGreater(perf["performance_score"], 0.0)
        self.assertEqual(perf["components"]["goal_score"], 70.0)

        # Empty skill requirements
        gaps = SkillGapService.evaluate_skill_gaps(
            employee_id="TEST_EMPTY",
            target_role_id=None,
            target_role_name=None,
            employee_skills=[],
            role_requirements=[]
        )
        self.assertEqual(gaps["overall_match_pct"], 100.0)

        # Calibration with no manager evaluation
        cal = CalibrationService.evaluate_employee_calibration(
            employee_id="TEST_EMPTY",
            employee_name="Test User",
            manager_evaluations=[],
            evidence_score=perf["performance_score"]
        )
        self.assertFalse(cal["flag"])
        self.assertIsNone(cal["manager_rating"])
        self.assertIn("No manager evaluation", cal["message"])

    # =========================================================================
    # 9. HTTP API Endpoints Tests
    # =========================================================================
    def test_17_http_performance_endpoint(self):
        url = f"{self.base_url}/api/employees/EMP001/performance"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertEqual(data["employee_id"], "EMP001")
            self.assertIn("performance_score", data)
            self.assertIn("components", data)

    def test_18_http_gaps_endpoint(self):
        url = f"{self.base_url}/api/employees/EMP002/gaps"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertEqual(data["employee_id"], "EMP002")
            crit_names = [g["skill_name"] for g in data["critical_gaps"]]
            self.assertIn("Distributed Systems", crit_names)
            self.assertIn("Kubernetes", crit_names)

    def test_19_http_career_endpoint(self):
        url = f"{self.base_url}/api/employees/EMP001/career"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertEqual(len(data["milestones"]), 4)

    def test_20_http_promotion_endpoint(self):
        url = f"{self.base_url}/api/employees/EMP001/promotion"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertEqual(data["readiness_level"], "Ready Now")

    def test_21_http_calibration_endpoints(self):
        # Org calibration
        url = f"{self.base_url}/api/calibration"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertEqual(data["total_evaluated"], 30)

        # Single Priya calibration
        url_priya = f"{self.base_url}/api/calibration/EMP003"
        req_p = urllib.request.Request(url_priya)
        with urllib.request.urlopen(req_p) as resp:
            self.assertEqual(resp.status, 200)
            data = json.loads(resp.read().decode())
            self.assertTrue(data["flag"])
            self.assertEqual(data["message"], "Potential evaluation inconsistency detected.")

    def test_22_http_post_analyze_endpoint(self):
        for emp_id in ["EMP001", "EMP002", "EMP003"]:
            url = f"{self.base_url}/api/analyze/{emp_id}"
            req = urllib.request.Request(url, data=b"", method="POST")
            with urllib.request.urlopen(req) as resp:
                self.assertEqual(resp.status, 200)
                data = json.loads(resp.read().decode())
                self.assertEqual(data["employee"]["employee_id"], emp_id)
                self.assertIn("performance", data)
                self.assertIn("skills", data)
                self.assertIn("career", data)
                self.assertIn("promotion", data)
                self.assertIn("calibration", data)
                self.assertIn("explanation", data)
                self.assertTrue(data["persisted"])

    def test_23_human_in_the_loop_advisory_language(self):
        """Verify that recommendations and explanations use purely advisory language without authoritative decision mandates."""
        for emp_id in ["EMP001", "EMP002", "EMP003"]:
            res = AnalysisOrchestrator.analyze_employee(self.db, emp_id, persist=False)
            narrative = res["explanation_narrative"].lower()
            actions_text = json.dumps(res["promotion"]["development_actions"]).lower()
            career_actions_text = json.dumps(res["career"]["recommended_development_actions"]).lower()

            # Disallowed authoritative phrases
            self.assertNotIn("submit formal promotion nomination dossier", narrative)
            self.assertNotIn("submit formal promotion nomination dossier", actions_text)
            self.assertNotIn("submit formal promotion nomination dossier", career_actions_text)
            self.assertNotIn("must promote", narrative)
            self.assertNotIn("should definitely promote", narrative)
            self.assertNotIn("promotion approved", narrative)
            self.assertNotIn("promotion granted", narrative)
            self.assertNotIn("manager is biased", narrative)
            self.assertNotIn("manager is wrong", narrative)

            # Mandatory advisory disclaimers
            self.assertIn("final promotion decisions remain with hr and managers.", res["promotion"]["disclaimer"].lower())
            self.assertIn("recommendation engine", res["career"]["disclaimer"].lower())
            self.assertTrue(res["promotion"]["human_review_required"])
            self.assertIn("readiness_assessment_note", res["promotion"])


if __name__ == "__main__":
    unittest.main()
