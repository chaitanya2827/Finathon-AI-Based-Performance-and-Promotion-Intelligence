"""
ZEROBUGS HRM-05: Analysis Orchestrator Service
Coordinates the end-to-end analytics workflow:
Employee Evidence -> Performance -> Skill Gaps -> Career Pathway ->
Promotion Readiness -> Calibration -> Explainable AI Summary -> Persistence
"""

import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.database.repository import EmployeeRepository
from backend.app.services.performance_service import PerformanceService
from backend.app.services.skill_gap_service import SkillGapService
from backend.app.services.career_service import CareerService
from backend.app.services.promotion_service import PromotionService
from backend.app.services.calibration_service import CalibrationService
from backend.app.services.reasoning_service import ReasoningService


class AnalysisOrchestrator:
    """Master orchestrator for ZEROBUGS HRM-05 explainable analytics engine."""

    @classmethod
    def analyze_employee(
        cls,
        db: Session,
        employee_id: str,
        persist: bool = True
    ) -> Optional[Dict[str, Any]]:
        """
        Execute comprehensive analysis across all evidence dimensions.
        Ensures consistent evidence sharing across sub-services without redundant DB roundtrips.
        """
        # 1. Fetch employee and relationships
        employee = EmployeeRepository.get_employee_by_id(db, employee_id)
        if not employee:
            return None

        # 2. Fetch all 9 evidence dimensions in a single coordinated pass
        goals = EmployeeRepository.get_employee_goals(db, employee_id)
        projects = EmployeeRepository.get_employee_projects(db, employee_id)
        feedback = EmployeeRepository.get_employee_feedback(db, employee_id)
        emp_skills = EmployeeRepository.get_employee_skills(db, employee_id)
        trainings = EmployeeRepository.get_employee_training(db, employee_id)
        attendance = EmployeeRepository.get_employee_attendance(db, employee_id)
        impacts = EmployeeRepository.get_employee_business_impact(db, employee_id)
        manager_evals = EmployeeRepository.get_employee_manager_evaluations(db, employee_id)

        target_role_id = employee.target_role_id
        target_role_name = employee.target_role.name if employee.target_role else None
        role_reqs = EmployeeRepository.get_role_required_skills(db, target_role_id) if target_role_id else []

        employee_info = {
            "employee_id": employee.employee_id,
            "name": employee.name,
            "department": employee.department,
            "current_role": employee.current_role.name if employee.current_role else None,
            "target_role": target_role_name
        }

        # 3. Performance Analysis
        performance_result = PerformanceService.evaluate_performance(
            employee_id=employee_id,
            goals=goals,
            projects=projects,
            feedback=feedback,
            attendance=attendance,
            impacts=impacts
        )

        # 4. Skill Assessment & Gap Detection
        skill_gap_result = SkillGapService.evaluate_skill_gaps(
            employee_id=employee_id,
            target_role_id=target_role_id,
            target_role_name=target_role_name,
            employee_skills=emp_skills,
            role_requirements=role_reqs
        )

        # 5. Career Path Recommendation
        curr_role_dict = {
            "id": employee.current_role.id if employee.current_role else None,
            "name": employee.current_role.name if employee.current_role else None,
            "department": employee.current_role.department if employee.current_role else None
        }
        targ_role_dict = {
            "id": employee.target_role.id if employee.target_role else None,
            "name": target_role_name,
            "department": employee.target_role.department if employee.target_role else None
        }
        career_result = CareerService.generate_career_path(
            employee_id=employee_id,
            current_role=curr_role_dict,
            target_role=targ_role_dict,
            skill_gap_result=skill_gap_result,
            performance_result=performance_result,
            trainings=trainings,
            projects=projects
        )

        # 6. Promotion Readiness Evaluation
        promotion_result = PromotionService.evaluate_readiness(
            employee_id=employee_id,
            performance_result=performance_result,
            skill_gap_result=skill_gap_result
        )

        # 7. Manager Calibration & Inconsistency Detection
        calibration_result = CalibrationService.evaluate_employee_calibration(
            employee_id=employee_id,
            employee_name=employee.name,
            manager_evaluations=manager_evals,
            evidence_score=performance_result["performance_score"],
            evidence_breakdown=performance_result.get("evidence", {})
        )

        # 8. AI Reasoning & Narrative Summary
        reasoning_result = ReasoningService.generate_reasoning(
            employee_info=employee_info,
            performance_result=performance_result,
            skill_gap_result=skill_gap_result,
            career_result=career_result,
            promotion_result=promotion_result,
            calibration_result=calibration_result
        )

        generated_at = datetime.now(timezone.utc).isoformat()

        # 9. Persistence into ANALYSIS_RESULTS table
        if persist:
            record_data = {
                "employee_id": employee_id,
                "readiness_level": promotion_result["readiness_level"],
                "strengths": json.dumps(promotion_result["strengths"]),
                "evidence_summary": json.dumps({
                    "performance_score": performance_result["performance_score"],
                    "components": performance_result["components"],
                    "supporting_evidence": promotion_result["supporting_evidence"]
                }),
                "missing_requirements": json.dumps(promotion_result["missing_requirements"]),
                "development_actions": json.dumps(promotion_result["development_actions"]),
                "calibration_details": json.dumps({
                    "manager_rating": calibration_result["manager_rating"],
                    "manager_normalized_score": calibration_result["manager_normalized_score"],
                    "evidence_score": calibration_result["evidence_score"],
                    "variance": calibration_result["variance"],
                    "flag": calibration_result["flag"],
                    "message": calibration_result["message"]
                }),
                "generated_at": generated_at
            }
            EmployeeRepository.save_analysis_result(db, record_data)

        # 10. Assemble complete frontend-ready response
        return {
            "employee": employee_info,
            "performance": performance_result,
            "skills": skill_gap_result,
            "career": career_result,
            "promotion": promotion_result,
            "calibration": calibration_result,
            "explanation": reasoning_result,
            "explanation_narrative": reasoning_result["full_narrative"],
            "persisted": persist,
            "generated_at": generated_at
        }
