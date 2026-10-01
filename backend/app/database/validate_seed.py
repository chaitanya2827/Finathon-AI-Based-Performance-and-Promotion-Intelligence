"""
Data validation script for ZEROBUGS HRM-05 seed data.
Validates required fields, types, ranges, uniqueness, and referential integrity.
"""

import json
import os
import sys
from pathlib import Path


def validate_seed_data(seed_path: str = None) -> bool:
    if seed_path is None:
        # Determine default path relative to this script
        base_dir = Path(__file__).resolve().parent.parent.parent.parent
        seed_path = base_dir / "data" / "seed_data.json"
    else:
        seed_path = Path(seed_path)

    if not seed_path.exists():
        print(f"ERROR: Seed file not found at {seed_path}")
        return False

    with open(seed_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except Exception as e:
            print(f"ERROR: Failed to parse JSON: {e}")
            return False

    errors = []
    statuses = {}

    # Extract tables
    roles = data.get("roles", [])
    skills = data.get("skills", [])
    role_reqs = data.get("role_requirements", [])
    employees = data.get("employees", [])
    goals = data.get("goals", [])
    projects = data.get("projects", [])
    feedback = data.get("feedback", [])
    emp_skills = data.get("employee_skills", [])
    training = data.get("training", [])
    attendance = data.get("attendance", [])
    business_impact = data.get("business_impact", [])
    manager_evals = data.get("manager_evaluations", [])

    role_ids = {r.get("id") for r in roles if "id" in r}
    skill_ids = {s.get("id") for s in skills if "id" in s}
    emp_ids = {e.get("id") for e in employees if "id" in e}

    # 1. Employees Validation
    emp_errors = []
    if len(employees) != len(emp_ids):
        emp_errors.append("Duplicate employee IDs found.")
    for emp in employees:
        req = ["id", "name", "email", "department", "current_role_id", "target_role_id", "manager", "hire_date"]
        missing = [f for f in req if not emp.get(f)]
        if missing:
            emp_errors.append(f"Employee {emp.get('id', 'Unknown')} missing fields: {missing}")
        if emp.get("current_role_id") not in role_ids:
            emp_errors.append(f"Employee {emp.get('id')} has invalid current_role_id: {emp.get('current_role_id')}")
        if emp.get("target_role_id") not in role_ids:
            emp_errors.append(f"Employee {emp.get('id')} has invalid target_role_id: {emp.get('target_role_id')}")
    statuses["Employees"] = "PASS" if not emp_errors else f"FAIL ({len(emp_errors)} issues)"
    errors.extend(emp_errors)

    # 2. Goals Validation
    goal_errors = []
    goal_ids = set()
    for g in goals:
        gid = g.get("id")
        if not gid or gid in goal_ids:
            goal_errors.append(f"Invalid or duplicate goal ID: {gid}")
        goal_ids.add(gid)
        if g.get("employee_id") not in emp_ids:
            goal_errors.append(f"Goal {gid} references unknown employee_id: {g.get('employee_id')}")
        req = ["title", "category", "target_value", "achieved_value", "progress_percentage", "verification_evidence"]
        missing = [f for f in req if g.get(f) is None]
        if missing:
            goal_errors.append(f"Goal {gid} missing fields: {missing}")
        if not (0 <= g.get("progress_percentage", 0) <= 200):
            goal_errors.append(f"Goal {gid} progress percentage out of range: {g.get('progress_percentage')}")
    statuses["Goals"] = "PASS" if not goal_errors else f"FAIL ({len(goal_errors)} issues)"
    errors.extend(goal_errors)

    # 3. Projects Validation
    proj_errors = []
    proj_ids = set()
    for p in projects:
        pid = p.get("id")
        if not pid or pid in proj_ids:
            proj_errors.append(f"Invalid or duplicate project ID: {pid}")
        proj_ids.add(pid)
        if p.get("employee_id") not in emp_ids:
            proj_errors.append(f"Project {pid} references unknown employee_id: {p.get('employee_id')}")
        req = ["project_name", "role", "deliverables", "delivered_on_time", "quality_score", "outcome_evidence"]
        missing = [f for f in req if p.get(f) is None]
        if missing:
            proj_errors.append(f"Project {pid} missing fields: {missing}")
        score = p.get("quality_score", 0)
        if not (1.0 <= score <= 5.0):
            proj_errors.append(f"Project {pid} quality score out of range (1-5): {score}")
    statuses["Projects"] = "PASS" if not proj_errors else f"FAIL ({len(proj_errors)} issues)"
    errors.extend(proj_errors)

    # 4. Feedback Validation
    fb_errors = []
    fb_ids = set()
    for fb in feedback:
        fbid = fb.get("id")
        if not fbid or fbid in fb_ids:
            fb_errors.append(f"Invalid or duplicate feedback ID: {fbid}")
        fb_ids.add(fbid)
        if fb.get("employee_id") not in emp_ids:
            fb_errors.append(f"Feedback {fbid} references unknown employee_id: {fb.get('employee_id')}")
        rating = fb.get("rating", 0)
        if not (1.0 <= rating <= 5.0):
            fb_errors.append(f"Feedback {fbid} rating out of range (1-5): {rating}")
        if not fb.get("comments"):
            fb_errors.append(f"Feedback {fbid} missing comments")
    statuses["Feedback"] = "PASS" if not fb_errors else f"FAIL ({len(fb_errors)} issues)"
    errors.extend(fb_errors)

    # 5. Skills Validation
    skill_errors = []
    es_ids = set()
    for es in emp_skills:
        esid = es.get("id")
        if not esid or esid in es_ids:
            skill_errors.append(f"Invalid or duplicate employee skill ID: {esid}")
        es_ids.add(esid)
        if es.get("employee_id") not in emp_ids:
            skill_errors.append(f"Employee skill {esid} references unknown employee_id: {es.get('employee_id')}")
        if es.get("skill_id") not in skill_ids:
            skill_errors.append(f"Employee skill {esid} references unknown skill_id: {es.get('skill_id')}")
        lvl = es.get("proficiency_level", 0)
        if not (1 <= lvl <= 5):
            skill_errors.append(f"Employee skill {esid} proficiency out of range (1-5): {lvl}")
        if not es.get("verification_evidence"):
            skill_errors.append(f"Employee skill {esid} missing verification_evidence")
    statuses["Skills"] = "PASS" if not skill_errors else f"FAIL ({len(skill_errors)} issues)"
    errors.extend(skill_errors)

    # 6. Training Validation
    trn_errors = []
    trn_ids = set()
    for t in training:
        tid = t.get("id")
        if not tid or tid in trn_ids:
            trn_errors.append(f"Invalid or duplicate training ID: {tid}")
        trn_ids.add(tid)
        if t.get("employee_id") not in emp_ids:
            trn_errors.append(f"Training {tid} references unknown employee_id: {t.get('employee_id')}")
        if not t.get("course") or t.get("hours", 0) <= 0:
            trn_errors.append(f"Training {tid} invalid course or hours")
    statuses["Training"] = "PASS" if not trn_errors else f"FAIL ({len(trn_errors)} issues)"
    errors.extend(trn_errors)

    # 7. Attendance Validation
    att_errors = []
    att_ids = set()
    for a in attendance:
        aid = a.get("id")
        if not aid or aid in att_ids:
            att_errors.append(f"Invalid or duplicate attendance ID: {aid}")
        att_ids.add(aid)
        if a.get("employee_id") not in emp_ids:
            att_errors.append(f"Attendance {aid} references unknown employee_id: {a.get('employee_id')}")
        pct = a.get("attendance_percentage", 0)
        if not (0.0 <= pct <= 100.0):
            att_errors.append(f"Attendance {aid} percentage out of range (0-100): {pct}")
    statuses["Attendance"] = "PASS" if not att_errors else f"FAIL ({len(att_errors)} issues)"
    errors.extend(att_errors)

    # 8. Business Impact Validation
    bi_errors = []
    bi_ids = set()
    for b in business_impact:
        bid = b.get("id")
        if not bid or bid in bi_ids:
            bi_errors.append(f"Invalid or duplicate business impact ID: {bid}")
        bi_ids.add(bid)
        if b.get("employee_id") not in emp_ids:
            bi_errors.append(f"Business impact {bid} references unknown employee_id: {b.get('employee_id')}")
        if not b.get("measurable_impact") or not b.get("value") or not b.get("evidence"):
            bi_errors.append(f"Business impact {bid} missing required attributes")
    statuses["Business Impact"] = "PASS" if not bi_errors else f"FAIL ({len(bi_errors)} issues)"
    errors.extend(bi_errors)

    # 9. Manager Evaluations Validation
    me_errors = []
    me_ids = set()
    for me in manager_evals:
        meid = me.get("id")
        if not meid or meid in me_ids:
            me_errors.append(f"Invalid or duplicate manager eval ID: {meid}")
        me_ids.add(meid)
        if me.get("employee_id") not in emp_ids:
            me_errors.append(f"Manager eval {meid} references unknown employee_id: {me.get('employee_id')}")
        r = me.get("rating", 0)
        if not (1.0 <= r <= 5.0):
            me_errors.append(f"Manager eval {meid} rating out of range (1-5): {r}")
        if not me.get("comments") or not me.get("manager"):
            me_errors.append(f"Manager eval {meid} missing comments or manager")
    statuses["Manager Evaluations"] = "PASS" if not me_errors else f"FAIL ({len(me_errors)} issues)"
    errors.extend(me_errors)

    # 10. Role Requirements Validation
    rr_errors = []
    rr_ids = set()
    for rr in role_reqs:
        rrid = rr.get("id")
        if not rrid or rrid in rr_ids:
            rr_errors.append(f"Invalid or duplicate role requirement ID: {rrid}")
        rr_ids.add(rrid)
        if rr.get("role_id") not in role_ids:
            rr_errors.append(f"Role requirement {rrid} references unknown role_id: {rr.get('role_id')}")
        if rr.get("skill_id") not in skill_ids:
            rr_errors.append(f"Role requirement {rrid} references unknown skill_id: {rr.get('skill_id')}")
        lvl = rr.get("required_level", 0)
        if not (1 <= lvl <= 5):
            rr_errors.append(f"Role requirement {rrid} level out of range (1-5): {lvl}")
    statuses["Role Requirements"] = "PASS" if not rr_errors else f"FAIL ({len(rr_errors)} issues)"
    errors.extend(rr_errors)

    # Print Report
    print("ZEROBUGS DATA VALIDATION")
    print("------------------------")
    for key, status in statuses.items():
        print(f"{key}: {status}")
    print()

    final_result = "PASS" if len(errors) == 0 else "FAIL"
    print(f"FINAL RESULT: {final_result}")

    if errors:
        print("\nErrors encountered:")
        for err in errors:
            print(f" - {err}")

    return len(errors) == 0


if __name__ == "__main__":
    success = validate_seed_data()
    sys.exit(0 if success else 1)
