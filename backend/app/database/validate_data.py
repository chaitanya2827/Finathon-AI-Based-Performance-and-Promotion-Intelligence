"""
Validation script for ZEROBUGS HRM-05 Synthetic HR Dataset (Phase 2).
Validates schema, data types, ranges, uniqueness, referential integrity,
and confirms the presence of all 3 demo scenarios.
"""

import json
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_FILE = BASE_DIR / "data" / "synthetic_hr_data.json"


def validate_synthetic_dataset(data_path: Path = DATA_FILE) -> tuple[bool, dict]:
    if not data_path.exists():
        print(f"ERROR: Dataset not found at {data_path}")
        return False, {}

    with open(data_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except Exception as e:
            print(f"ERROR: Failed to parse JSON: {e}")
            return False, {}

    errors = []
    statuses = {}

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

    role_ids = {r["id"] for r in roles if "id" in r}
    skill_ids = {s["id"] for s in skills if "id" in s}
    emp_ids = {e["employee_id"] for e in employees if "employee_id" in e}
    emails = {e["email"] for e in employees if "email" in e}

    # 1. Employees Validation
    emp_errs = []
    if len(employees) != len(emp_ids):
        emp_errs.append("Duplicate employee_id found.")
    if len(employees) != len(emails):
        emp_errs.append("Duplicate email addresses found.")
    for emp in employees:
        for f in ["employee_id", "name", "email", "department", "current_role_id", "target_role_id", "hire_date"]:
            if not emp.get(f):
                emp_errs.append(f"Employee {emp.get('employee_id')} missing required field: {f}")
        if emp.get("current_role_id") not in role_ids:
            emp_errs.append(f"Employee {emp.get('employee_id')} invalid current_role_id: {emp.get('current_role_id')}")
        if emp.get("target_role_id") not in role_ids:
            emp_errs.append(f"Employee {emp.get('employee_id')} invalid target_role_id: {emp.get('target_role_id')}")
        if emp.get("manager_id") and emp.get("manager_id") not in emp_ids:
            emp_errs.append(f"Employee {emp.get('employee_id')} invalid manager_id: {emp.get('manager_id')}")
    statuses["Employees"] = "PASS" if not emp_errs else f"FAIL ({len(emp_errs)} issues)"
    errors.extend(emp_errs)

    # 2. Goals Validation
    goal_errs = []
    goal_ids = set()
    for g in goals:
        gid = g.get("id")
        if not gid or gid in goal_ids:
            goal_errs.append(f"Duplicate/invalid goal_id: {gid}")
        goal_ids.add(gid)
        if g.get("employee_id") not in emp_ids:
            goal_errs.append(f"Goal {gid} unknown employee_id: {g.get('employee_id')}")
        pct = g.get("progress_pct")
        if pct is None or not (0.0 <= pct <= 100.0):
            goal_errs.append(f"Goal {gid} progress_pct out of range 0-100: {pct}")
    statuses["Goals"] = "PASS" if not goal_errs else f"FAIL ({len(goal_errs)} issues)"
    errors.extend(goal_errs)

    # 3. Projects Validation
    proj_errs = []
    proj_ids = set()
    for p in projects:
        pid = p.get("id")
        if not pid or pid in proj_ids:
            proj_errs.append(f"Duplicate/invalid project_id: {pid}")
        proj_ids.add(pid)
        if p.get("employee_id") not in emp_ids:
            proj_errs.append(f"Project {pid} unknown employee_id: {p.get('employee_id')}")
        cqs = p.get("code_quality_score")
        if cqs is not None and not (1.0 <= cqs <= 5.0):
            proj_errs.append(f"Project {pid} code_quality_score out of range 1-5: {cqs}")
    statuses["Projects"] = "PASS" if not proj_errs else f"FAIL ({len(proj_errs)} issues)"
    errors.extend(proj_errs)

    # 4. Feedback Validation
    fb_errs = []
    fb_ids = set()
    for fb in feedback:
        fbid = fb.get("id")
        if not fbid or fbid in fb_ids:
            fb_errs.append(f"Duplicate/invalid feedback_id: {fbid}")
        fb_ids.add(fbid)
        if fb.get("employee_id") not in emp_ids:
            fb_errs.append(f"Feedback {fbid} unknown employee_id: {fb.get('employee_id')}")
        rating = fb.get("rating")
        if rating is None or not (1.0 <= rating <= 5.0):
            fb_errs.append(f"Feedback {fbid} rating out of range 1-5: {rating}")
        if fb.get("sentiment") not in ("positive", "neutral", "mixed", "negative"):
            fb_errs.append(f"Feedback {fbid} invalid sentiment: {fb.get('sentiment')}")
    statuses["Feedback"] = "PASS" if not fb_errs else f"FAIL ({len(fb_errs)} issues)"
    errors.extend(fb_errs)

    # 5. Skills Validation
    skill_errs = []
    es_ids = set()
    for es in emp_skills:
        esid = es.get("id")
        if not esid or esid in es_ids:
            skill_errs.append(f"Duplicate/invalid employee_skill id: {esid}")
        es_ids.add(esid)
        if es.get("employee_id") not in emp_ids:
            skill_errs.append(f"Employee skill {esid} unknown employee_id: {es.get('employee_id')}")
        if es.get("skill_id") not in skill_ids:
            skill_errs.append(f"Employee skill {esid} unknown skill_id: {es.get('skill_id')}")
        lvl = es.get("proficiency_level")
        if lvl is None or not (1 <= lvl <= 5):
            skill_errs.append(f"Employee skill {esid} proficiency out of range 1-5: {lvl}")
    statuses["Skills"] = "PASS" if not skill_errs else f"FAIL ({len(skill_errs)} issues)"
    errors.extend(skill_errs)

    # 6. Training Validation
    trn_errs = []
    trn_ids = set()
    for trn in training:
        tid = trn.get("id")
        if not tid or tid in trn_ids:
            trn_errs.append(f"Duplicate/invalid training id: {tid}")
        trn_ids.add(tid)
        if trn.get("employee_id") not in emp_ids:
            trn_errs.append(f"Training {tid} unknown employee_id: {trn.get('employee_id')}")
        if trn.get("completion_status") not in ("completed", "in_progress", "planned"):
            trn_errs.append(f"Training {tid} invalid completion_status: {trn.get('completion_status')}")
    statuses["Training"] = "PASS" if not trn_errs else f"FAIL ({len(trn_errs)} issues)"
    errors.extend(trn_errs)

    # 7. Attendance Validation
    att_errs = []
    att_ids = set()
    for att in attendance:
        aid = att.get("id")
        if not aid or aid in att_ids:
            att_errs.append(f"Duplicate/invalid attendance id: {aid}")
        att_ids.add(aid)
        if att.get("employee_id") not in emp_ids:
            att_errs.append(f"Attendance {aid} unknown employee_id: {att.get('employee_id')}")
        pct = att.get("attendance_pct")
        if pct is None or not (0.0 <= pct <= 100.0):
            att_errs.append(f"Attendance {aid} percentage out of range 0-100: {pct}")
    statuses["Attendance"] = "PASS" if not att_errs else f"FAIL ({len(att_errs)} issues)"
    errors.extend(att_errs)

    # 8. Business Impact Validation
    bi_errs = []
    bi_ids = set()
    for bi in business_impact:
        bid = bi.get("id")
        if not bid or bid in bi_ids:
            bi_errs.append(f"Duplicate/invalid business impact id: {bid}")
        bi_ids.add(bid)
        if bi.get("employee_id") not in emp_ids:
            bi_errs.append(f"Business impact {bid} unknown employee_id: {bi.get('employee_id')}")
        if not bi.get("impact_type") or not bi.get("metric_name") or not bi.get("value"):
            bi_errs.append(f"Business impact {bid} missing required attributes")
    statuses["Business Impact"] = "PASS" if not bi_errs else f"FAIL ({len(bi_errs)} issues)"
    errors.extend(bi_errs)

    # 9. Manager Evaluations Validation
    me_errs = []
    me_ids = set()
    for me in manager_evals:
        meid = me.get("id")
        if not meid or meid in me_ids:
            me_errs.append(f"Duplicate/invalid manager evaluation id: {meid}")
        me_ids.add(meid)
        if me.get("employee_id") not in emp_ids:
            me_errs.append(f"Manager evaluation {meid} unknown employee_id: {me.get('employee_id')}")
        rating = me.get("rating")
        if rating is None or not (1.0 <= rating <= 5.0):
            me_errs.append(f"Manager evaluation {meid} rating out of range 1-5: {rating}")
    statuses["Manager Evaluations"] = "PASS" if not me_errs else f"FAIL ({len(me_errs)} issues)"
    errors.extend(me_errs)

    # 10. Demo Scenarios Check
    demo_statuses = {}

    # Elena (EMP001): Strong performer, 94-98% goals, high manager rating (4.8), meets Tech Lead skills
    elena = next((e for e in employees if e.get("employee_id") == "EMP001"), None)
    elena_goals = [g for g in goals if g.get("employee_id") == "EMP001"]
    elena_me = next((m for m in manager_evals if m.get("employee_id") == "EMP001"), None)
    if elena and len(elena_goals) >= 2 and elena_me and elena_me.get("rating", 0) >= 4.5:
        demo_statuses["Elena"] = "PASS"
    else:
        demo_statuses["Elena"] = "FAIL"
        errors.append("Demo Elena verification failed.")

    # Marcus (EMP002): Good performer, but clear skill gaps in Distributed Systems & K8s
    marcus = next((e for e in employees if e.get("employee_id") == "EMP002"), None)
    marcus_skills = {es.get("skill_id"): es.get("proficiency_level") for es in emp_skills if es.get("employee_id") == "EMP002"}
    if marcus and marcus_skills.get("SKILL_DIST_SYS", 5) <= 2 and marcus_skills.get("SKILL_K8S", 5) <= 2:
        demo_statuses["Marcus"] = "PASS"
    else:
        demo_statuses["Marcus"] = "FAIL"
        errors.append("Demo Marcus skill gap verification failed.")

    # Priya (EMP003): Strong objective evidence, but manager rating significantly lower (~2.8)
    priya = next((e for e in employees if e.get("employee_id") == "EMP003"), None)
    priya_fb = [fb for fb in feedback if fb.get("employee_id") == "EMP003"]
    priya_avg_fb = sum(f.get("rating", 0) for f in priya_fb) / len(priya_fb) if priya_fb else 0
    priya_me = next((m for m in manager_evals if m.get("employee_id") == "EMP003"), None)
    if priya and priya_avg_fb >= 4.5 and priya_me and priya_me.get("rating", 5) <= 3.0:
        demo_statuses["Priya"] = "PASS"
    else:
        demo_statuses["Priya"] = "FAIL"
        errors.append("Demo Priya inconsistency verification failed.")

    # Print Validation Report
    print("DATA VALIDATION")
    print("---------------")
    for key, st in statuses.items():
        print(f"{key}: {st}")
    print()

    print("Demo Scenarios:")
    for key, st in demo_statuses.items():
        print(f"{key}: {st}")
    print()

    passed = len(errors) == 0
    result_str = "PASSED" if passed else "FAILED"
    print(f"Overall Dataset Validation: {result_str}")

    if errors:
        print("\nErrors encountered:")
        for err in errors[:10]:
            print(f" - {err}")

    return passed, {"statuses": statuses, "demo_statuses": demo_statuses}


if __name__ == "__main__":
    success, _ = validate_synthetic_dataset()
    sys.exit(0 if success else 1)
