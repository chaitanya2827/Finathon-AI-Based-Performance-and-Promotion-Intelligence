"""
ZEROBUGS HRM-05: Career Path & Progression Service
Generates evidence-backed development roadmaps, milestones, and actionable recommendations
to bridge competencies between an employee's current role and target role.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.database.repository import EmployeeRepository
from backend.app.models import Employee, Training, Project


class CareerService:
    """Career roadmap recommendation engine (recommender, not decision-maker)."""

    @classmethod
    def generate_career_path(
        cls,
        employee_id: str,
        current_role: Dict[str, Optional[str]],
        target_role: Dict[str, Optional[str]],
        skill_gap_result: Dict[str, Any],
        performance_result: Dict[str, Any],
        trainings: List[Training],
        projects: List[Project]
    ) -> Dict[str, Any]:
        """
        Synthesize role expectations, skill deficits, training programs, and projects
        into a structured 4-step development pathway.
        """
        critical_gaps = skill_gap_result.get("critical_gaps", [])
        moderate_gaps = skill_gap_result.get("moderate_gaps", [])
        perf_score = performance_result.get("performance_score", 0.0)

        curr_name = current_role.get("name") or "Current Role"
        targ_name = target_role.get("name") or "Target Role"

        # Formulate contextual narrative
        if not critical_gaps and not moderate_gaps and perf_score >= 85.0:
            readiness_context = (
                f"Candidate currently in '{curr_name}' has satisfied core technical and operational benchmark expectations "
                f"for the '{targ_name}' profile. Recommended focus is on compiling evidence for HR and manager review "
                f"during the next formal career discussion, alongside sustained leadership continuity."
            )
        elif critical_gaps:
            gap_names = ", ".join(g["skill_name"] for g in critical_gaps[:2])
            readiness_context = (
                f"Candidate currently in '{curr_name}' is progressing toward '{targ_name}'. "
                f"Addressing key mandatory competency deficits in {gap_names} is recommended prior to formal career progression review."
            )
        else:
            readiness_context = (
                f"Candidate currently in '{curr_name}' exhibits solid fundamentals for '{targ_name}'. "
                f"Recommended development centers on expanding scope of business impact and project leadership."
            )

        # Build Milestones
        milestones: List[Dict[str, Any]] = []

        # Step 1: Technical & Mandatory Competencies
        if critical_gaps:
            primary_gap = critical_gaps[0]
            step1_title = f"Strengthen {primary_gap['skill_name']} to Target Level {primary_gap['required_level']}"
            step1_desc = f"Advance proficiency in {primary_gap['skill_name']} from current Level {primary_gap['current_level']} to required Level {primary_gap['required_level']} through hands-on system contributions."
            step1_status = "in_progress"
        else:
            step1_title = "Maintain Domain Excellence & Architectural Rigor"
            step1_desc = "Sustain advanced technical execution across primary system responsibilities and core tech stack."
            step1_status = "completed"
        milestones.append({
            "step": 1,
            "title": step1_title,
            "status": step1_status,
            "description": step1_desc
        })

        # Step 2: Training & Formal Development
        # Look for relevant in-progress or completed training
        in_prog_train = [t for t in trainings if t.completion_status.lower() in ("in_progress", "planned")]
        if in_prog_train:
            t_curr = in_prog_train[0]
            step2_title = f"Complete {t_curr.course_name}"
            step2_desc = f"Finalize ongoing course '{t_curr.course_name}' ({t_curr.skill_area}) to validate applied competence."
            step2_status = "in_progress"
        elif critical_gaps:
            step2_title = f"Formal Certification in {critical_gaps[-1]['skill_name']}"
            step2_desc = f"Enroll in dedicated technical coursework to accelerate {critical_gaps[-1]['skill_name']} mastery."
            step2_status = "recommended"
        else:
            step2_title = "Executive & Advanced Engineering Leadership Curriculum"
            step2_desc = "Complete strategic architecture and cross-functional leadership executive modules."
            step2_status = "completed" if trainings else "recommended"
        milestones.append({
            "step": 2,
            "title": step2_title,
            "status": step2_status,
            "description": step2_desc
        })

        # Step 3: Project Ownership
        step3_title = f"Demonstrate '{targ_name}' Scope in Production Deliverables"
        step3_desc = f"Demonstrate initiative leadership and execution aligned with {targ_name} responsibilities."
        step3_status = "completed" if perf_score >= 90.0 and len(projects) >= 2 else "in_progress"
        milestones.append({
            "step": 3,
            "title": step3_title,
            "status": step3_status,
            "description": step3_desc
        })

        # Step 4: Mentorship & Strategic Influence
        step4_title = "Expand Cross-Team Mentorship and Technical Governance"
        step4_desc = "Support team development through peer mentorship, design reviews, and engineering standards."
        step4_status = "completed" if perf_score >= 92.0 and not critical_gaps else "recommended"
        milestones.append({
            "step": 4,
            "title": step4_title,
            "status": step4_status,
            "description": step4_desc
        })

        # Recommended Development Actions
        actions: List[Dict[str, Any]] = []

        # Action from Critical Gaps
        for cg in critical_gaps:
            # Check if there is an in-progress training matching this gap
            matched_training = next(
                (t.course_name for t in trainings if cg["skill_name"].lower() in t.course_name.lower() or cg["skill_name"].lower() in t.skill_area.lower()),
                None
            )
            actions.append({
                "category": "Skill Development",
                "action": f"Close {cg['skill_name']} deficit (advance from Level {cg['current_level']} to Level {cg['required_level']})",
                "target_skill": cg["skill_name"],
                "recommended_resource": matched_training or f"Advanced {cg['skill_name']} Practical Lab & Architecture Review",
                "timeline": "0-3 Months" if cg["gap"] == 1 else "3-6 Months"
            })

        # Action from Moderate Gaps
        for mg in moderate_gaps:
            actions.append({
                "category": "Elective Upskilling",
                "action": f"Expand elective capability in {mg['skill_name']} to Level {mg['required_level']}",
                "target_skill": mg["skill_name"],
                "recommended_resource": f"Internal Tech Talks & {mg['skill_name']} Self-Paced Modules",
                "timeline": "6-12 Months"
            })

        # Action for Project Leadership
        actions.append({
            "category": "Project Leadership",
            "action": f"Take lead delivery ownership on an initiative aligned with {targ_name} expectations",
            "target_skill": "Project Ownership",
            "recommended_resource": "Quarterly Initiative Roadmap & Manager Sponsor Sync",
            "timeline": "3-6 Months"
        })

        # Action for Mentorship / Impact
        actions.append({
            "category": "Mentorship & Governance",
            "action": "Contribute to team design guidelines and provide structured peer pairing sessions",
            "target_skill": "Leadership & Mentorship",
            "recommended_resource": "Engineering RFC Governance Working Group",
            "timeline": "Ongoing"
        })

        # Advisory Action for Career Discussion Preparation
        if not critical_gaps:
            actions.append({
                "category": "Career Discussion Preparation",
                "action": "Compile relevant performance and development evidence for the next career discussion with manager and HR",
                "target_skill": "Career Planning",
                "recommended_resource": "Employee Evidence Package & Performance Summary",
                "timeline": "Upcoming Review Cycle"
            })

        return {
            "employee_id": employee_id,
            "current_role": current_role,
            "target_role": target_role,
            "readiness_context": readiness_context,
            "milestones": milestones,
            "recommended_development_actions": actions,
            "disclaimer": "The career service is a recommendation engine, not a decision-maker."
        }

    @classmethod
    def get_employee_career_path(
        cls,
        db: Session,
        employee_id: str,
        skill_gap_result: Optional[Dict[str, Any]] = None,
        performance_result: Optional[Dict[str, Any]] = None
    ) -> Optional[Dict[str, Any]]:
        """Fetch employee records and generate career pathway roadmap."""
        from backend.app.services.skill_gap_service import SkillGapService
        from backend.app.services.performance_service import PerformanceService

        emp = EmployeeRepository.get_employee_by_id(db, employee_id)
        if not emp:
            return None

        if skill_gap_result is None:
            skill_gap_result = SkillGapService.get_employee_skill_gaps(db, employee_id) or {}
        if performance_result is None:
            performance_result = PerformanceService.get_employee_performance(db, employee_id) or {}

        trainings = EmployeeRepository.get_employee_training(db, employee_id)
        projects = EmployeeRepository.get_employee_projects(db, employee_id)

        curr_role_info = {
            "id": emp.current_role.id if emp.current_role else None,
            "name": emp.current_role.name if emp.current_role else None,
            "department": emp.current_role.department if emp.current_role else None
        }
        targ_role_info = {
            "id": emp.target_role.id if emp.target_role else None,
            "name": emp.target_role.name if emp.target_role else None,
            "department": emp.target_role.department if emp.target_role else None
        }

        return cls.generate_career_path(
            employee_id=employee_id,
            current_role=curr_role_info,
            target_role=targ_role_info,
            skill_gap_result=skill_gap_result,
            performance_result=performance_result,
            trainings=trainings,
            projects=projects
        )
