"""
ZEROBUGS HRM-05: Skill Assessment & Gap Detection Service
Compares current employee skills against target role requirements to identify
critical vs. moderate development gaps, competencies met, and strong skills.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.database.repository import EmployeeRepository
from backend.app.models import Employee, EmployeeSkill, RoleRequiredSkill, Role, Skill


class SkillGapService:
    """Deterministic, evidence-based skill evaluation and gap detection engine."""

    @classmethod
    def evaluate_skill_gaps(
        cls,
        employee_id: str,
        target_role_id: Optional[str],
        target_role_name: Optional[str],
        employee_skills: List[EmployeeSkill],
        role_requirements: List[RoleRequiredSkill]
    ) -> Dict[str, Any]:
        """
        Compute granular skill gap metrics between employee competencies and target role expectations.
        """
        # Map employee's current skills by skill_id
        emp_skill_map = {}
        for es in employee_skills:
            emp_skill_map[es.skill_id] = {
                "proficiency_level": es.proficiency_level,
                "skill_name": es.skill.name if es.skill else es.skill_id,
                "category": es.skill.category if es.skill else "General",
                "verification_proof": es.verification_proof
            }

        if not target_role_id or not role_requirements:
            # Handle edge case where target role is unassigned or has no requirements
            all_emp_skills = [
                {
                    "skill_id": es.skill_id,
                    "skill_name": es.skill.name if es.skill else es.skill_id,
                    "category": es.skill.category if es.skill else "General",
                    "proficiency_level": es.proficiency_level
                }
                for es in employee_skills
            ]
            return {
                "employee_id": employee_id,
                "target_role_id": target_role_id,
                "target_role_name": target_role_name or "Unassigned Target Role",
                "total_required": 0,
                "mandatory_count": 0,
                "mandatory_met_count": 0,
                "overall_match_pct": 100.0,
                "mandatory_met_pct": 100.0,
                "critical_gaps": [],
                "moderate_gaps": [],
                "skills_meeting_requirements": [],
                "strong_skills": all_emp_skills
            }

        critical_gaps: List[Dict[str, Any]] = []
        moderate_gaps: List[Dict[str, Any]] = []
        met_skills: List[Dict[str, Any]] = []

        mandatory_count = 0
        mandatory_met_count = 0

        for req in role_requirements:
            s_id = req.skill_id
            s_name = req.skill.name if req.skill else s_id
            s_cat = req.skill.category if req.skill else "General"
            req_level = req.required_level
            is_mand = req.is_mandatory

            if is_mand:
                mandatory_count += 1

            current_data = emp_skill_map.get(s_id)
            current_level = current_data["proficiency_level"] if current_data else 0

            gap = req_level - current_level

            if gap <= 0:
                status = "meets_requirement"
                priority = "met"
                if is_mand:
                    mandatory_met_count += 1
                reason = f"Current level ({current_level}) meets or exceeds required level ({req_level})."
                met_skills.append({
                    "skill_id": s_id,
                    "skill_name": s_name,
                    "category": s_cat,
                    "current_level": current_level,
                    "required_level": req_level,
                    "gap": 0,
                    "status": status,
                    "is_mandatory": is_mand,
                    "priority": priority,
                    "reason": reason
                })
            else:
                status = "development_gap"
                if is_mand:
                    priority = "critical"
                    reason = f"Mandatory target-role competency requires Level {req_level}, currently at Level {current_level} (Deficit: {gap})."
                    critical_gaps.append({
                        "skill_id": s_id,
                        "skill_name": s_name,
                        "category": s_cat,
                        "current_level": current_level,
                        "required_level": req_level,
                        "gap": gap,
                        "status": status,
                        "is_mandatory": is_mand,
                        "priority": priority,
                        "reason": reason
                    })
                else:
                    priority = "moderate"
                    reason = f"Optional competency recommends Level {req_level}, currently at Level {current_level} (Deficit: {gap})."
                    moderate_gaps.append({
                        "skill_id": s_id,
                        "skill_name": s_name,
                        "category": s_cat,
                        "current_level": current_level,
                        "required_level": req_level,
                        "gap": gap,
                        "status": status,
                        "is_mandatory": is_mand,
                        "priority": priority,
                        "reason": reason
                    })

        # Gap Prioritization:
        # 1. Critical (mandatory) gaps first, ordered by gap size descending
        critical_gaps.sort(key=lambda x: x["gap"], reverse=True)
        # 2. Moderate (optional) gaps ordered by gap size descending
        moderate_gaps.sort(key=lambda x: x["gap"], reverse=True)
        # 3. Met skills ordered by proficiency level descending
        met_skills.sort(key=lambda x: x["current_level"], reverse=True)

        # Strong skills: competencies where employee possesses Level 4 or 5
        strong_skills = [
            {
                "skill_id": es.skill_id,
                "skill_name": es.skill.name if es.skill else es.skill_id,
                "category": es.skill.category if es.skill else "General",
                "proficiency_level": es.proficiency_level
            }
            for es in employee_skills
            if es.proficiency_level >= 4
        ]
        strong_skills.sort(key=lambda x: x["proficiency_level"], reverse=True)

        total_req = len(role_requirements)
        overall_match_pct = round((len(met_skills) / total_req) * 100.0, 2) if total_req > 0 else 100.0
        mandatory_met_pct = round((mandatory_met_count / mandatory_count) * 100.0, 2) if mandatory_count > 0 else 100.0

        return {
            "employee_id": employee_id,
            "target_role_id": target_role_id,
            "target_role_name": target_role_name,
            "total_required": total_req,
            "mandatory_count": mandatory_count,
            "mandatory_met_count": mandatory_met_count,
            "overall_match_pct": overall_match_pct,
            "mandatory_met_pct": mandatory_met_pct,
            "critical_gaps": critical_gaps,
            "moderate_gaps": moderate_gaps,
            "skills_meeting_requirements": met_skills,
            "strong_skills": strong_skills
        }

    @classmethod
    def get_employee_skill_gaps(cls, db: Session, employee_id: str) -> Optional[Dict[str, Any]]:
        """Fetch employee and target role data from DB and calculate skill gaps."""
        emp = EmployeeRepository.get_employee_by_id(db, employee_id)
        if not emp:
            return None

        emp_skills = EmployeeRepository.get_employee_skills(db, employee_id)
        target_role_id = emp.target_role_id
        target_role_name = emp.target_role.name if emp.target_role else None

        role_reqs = []
        if target_role_id:
            role_reqs = EmployeeRepository.get_role_required_skills(db, target_role_id)

        return cls.evaluate_skill_gaps(
            employee_id=employee_id,
            target_role_id=target_role_id,
            target_role_name=target_role_name,
            employee_skills=emp_skills,
            role_requirements=role_reqs
        )
