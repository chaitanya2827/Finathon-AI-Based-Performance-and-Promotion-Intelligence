"""
Database initialization script for ZEROBUGS HRM-05.
Creates all SQLite tables and loads synthetic_hr_data.json idempotently.
"""

import json
import sys
from pathlib import Path
from sqlalchemy.orm import Session

from backend.app.config import settings
from backend.app.database.database import engine, SessionLocal
from backend.app.database.base import Base
from backend.app.database.validate_data import validate_synthetic_dataset

# Import all models to register with Base.metadata
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


def init_database(data_path: Path = settings.SYNTHETIC_DATA_PATH) -> bool:
    print("=" * 60)
    print("ZEROBUGS HRM-05: Initializing Database")
    print(f"Target Database: {settings.DATABASE_PATH}")
    print(f"Dataset Path:    {data_path}")
    print("=" * 60)

    # 1. Validate dataset first
    is_valid, _ = validate_synthetic_dataset(data_path)
    if not is_valid:
        print("ERROR: Dataset validation failed. Aborting database initialization.")
        return False

    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 2. Ensure parent directory exists and create all tables
    settings.DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(bind=engine)
    print("Created database tables successfully.")

    db: Session = SessionLocal()
    try:
        # 3. Insert Roles
        existing_roles = {r.id for r in db.query(Role.id).all()}
        roles_to_add = []
        for r in data.get("roles", []):
            if r["id"] not in existing_roles:
                roles_to_add.append(Role(
                    id=r["id"],
                    name=r["name"],
                    department=r["department"],
                    description=r.get("description")
                ))
        if roles_to_add:
            db.add_all(roles_to_add)
            db.flush()
        print(f"Roles: {len(roles_to_add)} inserted, {len(existing_roles)} existing.")

        # 4. Insert Skills
        existing_skills = {s.id for s in db.query(Skill.id).all()}
        skills_to_add = []
        for s in data.get("skills", []):
            if s["id"] not in existing_skills:
                skills_to_add.append(Skill(
                    id=s["id"],
                    name=s["name"],
                    category=s["category"],
                    description=s.get("description")
                ))
        if skills_to_add:
            db.add_all(skills_to_add)
            db.flush()
        print(f"Skills: {len(skills_to_add)} inserted, {len(existing_skills)} existing.")

        # 5. Insert Role Requirements
        existing_reqs = {rq.id for rq in db.query(RoleRequiredSkill.id).all()}
        reqs_to_add = []
        for rq in data.get("role_requirements", []):
            if rq["id"] not in existing_reqs:
                reqs_to_add.append(RoleRequiredSkill(
                    id=rq["id"],
                    role_id=rq["role_id"],
                    skill_id=rq["skill_id"],
                    required_level=rq["required_level"],
                    is_mandatory=rq["is_mandatory"]
                ))
        if reqs_to_add:
            db.add_all(reqs_to_add)
            db.flush()
        print(f"Role Requirements: {len(reqs_to_add)} inserted, {len(existing_reqs)} existing.")

        # 6. Insert Employees
        existing_emps = {e.employee_id for e in db.query(Employee.employee_id).all()}
        emps_to_add = []
        for e in data.get("employees", []):
            if e["employee_id"] not in existing_emps:
                emps_to_add.append(Employee(
                    employee_id=e["employee_id"],
                    name=e["name"],
                    email=e["email"],
                    department=e["department"],
                    current_role_id=e["current_role_id"],
                    target_role_id=e["target_role_id"],
                    manager_id=e.get("manager_id"),
                    hire_date=e["hire_date"],
                    avatar_url=e.get("avatar_url")
                ))
        if emps_to_add:
            db.add_all(emps_to_add)
            db.flush()
        print(f"Employees: {len(emps_to_add)} inserted, {len(existing_emps)} existing.")

        # 7. Insert Goals
        existing_goals = {g.id for g in db.query(Goal.id).all()}
        goals_to_add = []
        for g in data.get("goals", []):
            if g["id"] not in existing_goals:
                goals_to_add.append(Goal(
                    id=g["id"],
                    employee_id=g["employee_id"],
                    title=g["title"],
                    category=g["category"],
                    target_value=g["target_value"],
                    achieved_value=g["achieved_value"],
                    metric_unit=g["metric_unit"],
                    progress_pct=g["progress_pct"],
                    verification_evidence=g["verification_evidence"]
                ))
        if goals_to_add:
            db.add_all(goals_to_add)
            db.flush()
        print(f"Goals: {len(goals_to_add)} inserted, {len(existing_goals)} existing.")

        # 8. Insert Projects
        existing_prjs = {p.id for p in db.query(Project.id).all()}
        prjs_to_add = []
        for p in data.get("projects", []):
            if p["id"] not in existing_prjs:
                prjs_to_add.append(Project(
                    id=p["id"],
                    employee_id=p["employee_id"],
                    project_name=p["project_name"],
                    role_in_project=p["role_in_project"],
                    deliverables=p["deliverables"],
                    delivered_on_time=p["delivered_on_time"],
                    code_quality_score=p.get("code_quality_score"),
                    outcome_evidence=p["outcome_evidence"]
                ))
        if prjs_to_add:
            db.add_all(prjs_to_add)
            db.flush()
        print(f"Projects: {len(prjs_to_add)} inserted, {len(existing_prjs)} existing.")

        # 9. Insert Feedback
        existing_fb = {f.id for f in db.query(Feedback.id).all()}
        fb_to_add = []
        for f in data.get("feedback", []):
            if f["id"] not in existing_fb:
                fb_to_add.append(Feedback(
                    id=f["id"],
                    employee_id=f["employee_id"],
                    reviewer_type=f["reviewer_type"],
                    rating=f["rating"],
                    comments=f["comments"],
                    sentiment=f["sentiment"]
                ))
        if fb_to_add:
            db.add_all(fb_to_add)
            db.flush()
        print(f"Feedback: {len(fb_to_add)} inserted, {len(existing_fb)} existing.")

        # 10. Insert Employee Skills
        existing_es = {es.id for es in db.query(EmployeeSkill.id).all()}
        es_to_add = []
        for es in data.get("employee_skills", []):
            if es["id"] not in existing_es:
                es_to_add.append(EmployeeSkill(
                    id=es["id"],
                    employee_id=es["employee_id"],
                    skill_id=es["skill_id"],
                    proficiency_level=es["proficiency_level"],
                    verification_proof=es["verification_proof"]
                ))
        if es_to_add:
            db.add_all(es_to_add)
            db.flush()
        print(f"Employee Skills: {len(es_to_add)} inserted, {len(existing_es)} existing.")

        # 11. Insert Training
        existing_trn = {t.id for t in db.query(Training.id).all()}
        trn_to_add = []
        for t in data.get("training", []):
            if t["id"] not in existing_trn:
                trn_to_add.append(Training(
                    id=t["id"],
                    employee_id=t["employee_id"],
                    course_name=t["course_name"],
                    provider=t["provider"],
                    completion_status=t["completion_status"],
                    completion_date=t.get("completion_date"),
                    skill_area=t["skill_area"]
                ))
        if trn_to_add:
            db.add_all(trn_to_add)
            db.flush()
        print(f"Training: {len(trn_to_add)} inserted, {len(existing_trn)} existing.")

        # 12. Insert Attendance
        existing_att = {a.id for a in db.query(Attendance.id).all()}
        att_to_add = []
        for a in data.get("attendance", []):
            if a["id"] not in existing_att:
                att_to_add.append(Attendance(
                    id=a["id"],
                    employee_id=a["employee_id"],
                    period=a["period"],
                    working_days=a["working_days"],
                    days_present=a["days_present"],
                    attendance_pct=a["attendance_pct"],
                    reliability_notes=a.get("reliability_notes")
                ))
        if att_to_add:
            db.add_all(att_to_add)
            db.flush()
        print(f"Attendance: {len(att_to_add)} inserted, {len(existing_att)} existing.")

        # 13. Insert Business Impact
        existing_bi = {b.id for b in db.query(BusinessImpact.id).all()}
        bi_to_add = []
        for b in data.get("business_impact", []):
            if b["id"] not in existing_bi:
                bi_to_add.append(BusinessImpact(
                    id=b["id"],
                    employee_id=b["employee_id"],
                    impact_type=b["impact_type"],
                    metric_name=b["metric_name"],
                    value=b["value"],
                    metric_unit=b["metric_unit"],
                    description=b["description"],
                    evidence=b["evidence"]
                ))
        if bi_to_add:
            db.add_all(bi_to_add)
            db.flush()
        print(f"Business Impact: {len(bi_to_add)} inserted, {len(existing_bi)} existing.")

        # 14. Insert Manager Evaluations
        existing_me = {m.id for m in db.query(ManagerEvaluation.id).all()}
        me_to_add = []
        for m in data.get("manager_evaluations", []):
            if m["id"] not in existing_me:
                me_to_add.append(ManagerEvaluation(
                    id=m["id"],
                    employee_id=m["employee_id"],
                    manager_name=m["manager_name"],
                    rating=m["rating"],
                    evaluation_cycle=m["evaluation_cycle"],
                    comments=m["comments"],
                    evaluation_date=m["evaluation_date"]
                ))
        if me_to_add:
            db.add_all(me_to_add)
            db.flush()
        print(f"Manager Evaluations: {len(me_to_add)} inserted, {len(existing_me)} existing.")

        db.commit()
        print("\nDatabase initialization completed successfully.")
        return True
    except Exception as e:
        db.rollback()
        print(f"ERROR: Database initialization failed: {e}")
        return False
    finally:
        db.close()


if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1)
