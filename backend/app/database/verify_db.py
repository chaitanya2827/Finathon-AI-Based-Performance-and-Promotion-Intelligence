"""
Database verification script for ZEROBUGS HRM-05.
Verifies file existence, table integrity, record counts, relationships,
and verifies the presence of demo personas Elena, Marcus, and Priya.
"""

import sys
from pathlib import Path
from sqlalchemy import inspect
from sqlalchemy.orm import Session

from backend.app.config import settings
from backend.app.database.database import engine, SessionLocal
from backend.app.models import (
    Role,
    Skill,
    RoleRequiredSkill,
    Employee,
    Goal,
    Project,
    Feedback,
    EmployeeSkill,
    Training,
    Attendance,
    BusinessImpact,
    ManagerEvaluation,
    AnalysisResult
)


def verify_database() -> bool:
    print("=" * 60)
    print("ZEROBUGS HRM-05: Database Verification")
    print("=" * 60)

    # 1. Check file existence
    if not settings.DATABASE_PATH.exists():
        print(f"Database: FAILED (file not found at {settings.DATABASE_PATH})")
        return False
    print("Database: OK")

    # 2. Check tables exist
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    expected_tables = {
        "roles", "skills", "role_required_skills", "employees", "goals",
        "projects", "feedback", "employee_skills", "training", "attendance",
        "business_impact", "manager_evaluations", "analysis_results"
    }

    missing_tables = expected_tables - existing_tables
    if missing_tables:
        print(f"Tables: FAILED (missing: {missing_tables})")
        return False
    print("Tables: OK")

    db: Session = SessionLocal()
    try:
        # 3. Counts
        c_roles = db.query(Role).count()
        c_skills = db.query(Skill).count()
        c_reqs = db.query(RoleRequiredSkill).count()
        c_emps = db.query(Employee).count()
        c_goals = db.query(Goal).count()
        c_prjs = db.query(Project).count()
        c_fb = db.query(Feedback).count()
        c_es = db.query(EmployeeSkill).count()
        c_trn = db.query(Training).count()
        c_att = db.query(Attendance).count()
        c_bi = db.query(BusinessImpact).count()
        c_me = db.query(ManagerEvaluation).count()

        print(f"Roles: {c_roles}")
        print(f"Skills: {c_skills}")
        print(f"Role Requirements: {c_reqs}")
        print(f"Employees: {c_emps}")
        print(f"Goals: {c_goals}")
        print(f"Projects: {c_prjs}")
        print(f"Feedback: {c_fb}")
        print(f"Employee Skills: {c_es}")
        print(f"Training: {c_trn}")
        print(f"Attendance: {c_att}")
        print(f"Business Impact: {c_bi}")
        print(f"Manager Evaluations: {c_me}")

        # Validate minimum expected counts
        if c_emps != 30:
            print(f"FAIL: Expected 30 employees, found {c_emps}")
            return False

        # 4. Check Demo Employees and Relationships
        elena = db.query(Employee).filter(Employee.employee_id == "EMP001").first()
        marcus = db.query(Employee).filter(Employee.employee_id == "EMP002").first()
        priya = db.query(Employee).filter(Employee.employee_id == "EMP003").first()

        if not elena or elena.name != "Elena Rostova":
            print("FAIL: Demo Employee Elena (EMP001) not found")
            return False
        if not marcus or marcus.name != "Marcus Chen":
            print("FAIL: Demo Employee Marcus (EMP002) not found")
            return False
        if not priya or priya.name != "Priya Sharma":
            print("FAIL: Demo Employee Priya (EMP003) not found")
            return False

        # Check relationships on Elena
        if not elena.goals or not elena.projects or not elena.skills or not elena.manager_evaluations:
            print("FAIL: Relationship mapping failed on Elena")
            return False

        # Check unique employee IDs
        emp_ids = [e.employee_id for e in db.query(Employee.employee_id).all()]
        if len(emp_ids) != len(set(emp_ids)):
            print("FAIL: Duplicate employee_id detected in database")
            return False

        print("\nDatabase Verification: PASSED")
        return True
    except Exception as e:
        print(f"ERROR during database verification: {e}")
        return False
    finally:
        db.close()


if __name__ == "__main__":
    success = verify_database()
    sys.exit(0 if success else 1)
