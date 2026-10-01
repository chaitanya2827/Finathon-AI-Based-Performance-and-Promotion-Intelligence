"""
Employee API endpoints (Read-only for Phase 2).
Provides endpoints to query employees and their 9 evidence dimensions.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.database.repository import EmployeeRepository
from backend.app.schemas import (
    EmployeeRead,
    EmployeeEvidenceRead,
    GoalRead,
    ProjectRead,
    FeedbackRead,
    EmployeeSkillRead,
    TrainingRead,
    AttendanceRead,
    BusinessImpactRead,
    ManagerEvaluationRead,
    PerformanceAnalysisResult,
    SkillGapAnalysisResult,
    CareerPathResult,
    PromotionReadinessResult
)
from backend.app.services.performance_service import PerformanceService
from backend.app.services.skill_gap_service import SkillGapService
from backend.app.services.career_service import CareerService
from backend.app.services.promotion_service import PromotionService

router = APIRouter(prefix="/employees", tags=["Employees"])


def check_employee_exists(db: Session, employee_id: str):
    """Helper to verify employee exists or raise 404."""
    emp = EmployeeRepository.get_employee_by_id(db, employee_id)
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found."
        )
    return emp


@router.get("", response_model=List[EmployeeRead])
def get_all_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve list of all employees."""
    return EmployeeRepository.get_all_employees(db, skip=skip, limit=limit)


@router.get("/{employee_id}", response_model=EmployeeRead)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve full profile of an employee by corporate ID (e.g. EMP001)."""
    return check_employee_exists(db, employee_id)


@router.get("/{employee_id}/evidence", response_model=EmployeeEvidenceRead)
def get_employee_evidence(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve the aggregated 9-dimension evidence package for an employee."""
    check_employee_exists(db, employee_id)
    evidence = EmployeeRepository.get_employee_evidence(db, employee_id)
    return evidence


@router.get("/{employee_id}/goals", response_model=List[GoalRead])
def get_employee_goals(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve all OKRs and goals for an employee."""
    check_employee_exists(db, employee_id)
    return EmployeeRepository.get_employee_goals(db, employee_id)


@router.get("/{employee_id}/projects", response_model=List[ProjectRead])
def get_employee_projects(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve all projects for an employee."""
    check_employee_exists(db, employee_id)
    return EmployeeRepository.get_employee_projects(db, employee_id)


@router.get("/{employee_id}/feedback", response_model=List[FeedbackRead])
def get_employee_feedback(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve all 360 feedback records for an employee."""
    check_employee_exists(db, employee_id)
    return EmployeeRepository.get_employee_feedback(db, employee_id)


@router.get("/{employee_id}/skills", response_model=List[EmployeeSkillRead])
def get_employee_skills(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve all evaluated skills and proficiency levels for an employee."""
    check_employee_exists(db, employee_id)
    return EmployeeRepository.get_employee_skills(db, employee_id)


@router.get("/{employee_id}/training", response_model=List[TrainingRead])
def get_employee_training(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve all training and development records for an employee."""
    check_employee_exists(db, employee_id)
    return EmployeeRepository.get_employee_training(db, employee_id)


@router.get("/{employee_id}/attendance", response_model=List[AttendanceRead])
def get_employee_attendance(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve attendance and operational reliability records for an employee."""
    check_employee_exists(db, employee_id)
    return EmployeeRepository.get_employee_attendance(db, employee_id)


@router.get("/{employee_id}/business-impact", response_model=List[BusinessImpactRead])
def get_employee_business_impact(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve business impact records for an employee."""
    check_employee_exists(db, employee_id)
    return EmployeeRepository.get_employee_business_impact(db, employee_id)


@router.get("/{employee_id}/manager-evaluations", response_model=List[ManagerEvaluationRead])
def get_employee_manager_evaluations(employee_id: str, db: Session = Depends(get_db)):
    """Retrieve manager evaluation records for an employee."""
    check_employee_exists(db, employee_id)
    return EmployeeRepository.get_employee_manager_evaluations(db, employee_id)


# ============================================================================
# PHASE 3: AI & Explainable Analytics Endpoints
# ============================================================================

@router.get("/{employee_id}/performance", response_model=PerformanceAnalysisResult, tags=["Performance"])
def get_employee_performance(employee_id: str, db: Session = Depends(get_db)):
    """
    Retrieve deterministic, evidence-based performance analysis across 5 dimensions:
    Goals (30%), Projects (25%), 360 Feedback (20%), Reliability (10%), Business Impact (15%).
    """
    check_employee_exists(db, employee_id)
    res = PerformanceService.get_employee_performance(db, employee_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Performance evaluation could not be generated for '{employee_id}'."
        )
    return res


@router.get("/{employee_id}/gaps", response_model=SkillGapAnalysisResult, tags=["Skills"])
def get_employee_skill_gaps(employee_id: str, db: Session = Depends(get_db)):
    """
    Retrieve granular skill gap assessment comparing current competencies against target role requirements.
    Categorizes skills into critical mandatory gaps, moderate optional gaps, and satisfied criteria.
    """
    check_employee_exists(db, employee_id)
    res = SkillGapService.get_employee_skill_gaps(db, employee_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Skill gap analysis could not be generated for '{employee_id}'."
        )
    return res


@router.get("/{employee_id}/career", response_model=CareerPathResult, tags=["Career"])
def get_employee_career_path(employee_id: str, db: Session = Depends(get_db)):
    """
    Generate evidence-backed career development roadmap, milestones, and actionable recommendations.
    Recommendation engine output (recommender, not decision-maker).
    """
    check_employee_exists(db, employee_id)
    res = CareerService.get_employee_career_path(db, employee_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Career roadmap could not be generated for '{employee_id}'."
        )
    return res


@router.get("/{employee_id}/promotion", response_model=PromotionReadinessResult, tags=["Promotion"])
def get_employee_promotion_readiness(employee_id: str, db: Session = Depends(get_db)):
    """
    Evaluate promotion readiness across four transparent dimensions:
    Performance, Competence, Consistency, and Impact.
    Outputs: 'Ready Now', 'Developing - Ready in 6-12 Months', or 'Needs Foundation'.
    """
    check_employee_exists(db, employee_id)
    res = PromotionService.get_employee_promotion_readiness(db, employee_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Promotion readiness evaluation could not be generated for '{employee_id}'."
        )
    return res
