"""
ZEROBUGS HRM-05: Calibration API Endpoints.
Provides endpoints for managerial evaluation calibration analysis
both organization-wide and per individual employee.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.database.repository import EmployeeRepository
from backend.app.schemas import (
    EmployeeCalibrationResult,
    OrgCalibrationSummaryResult
)
from backend.app.services.calibration_service import CalibrationService

router = APIRouter(prefix="/calibration", tags=["Calibration"])


@router.get("", response_model=OrgCalibrationSummaryResult)
def get_organization_calibration(db: Session = Depends(get_db)):
    """
    Retrieve organization-wide evaluation calibration metrics across all employees.
    Identifies variance between manager ratings and objective multi-factor evidence.
    Neutral inconsistency flagging applied when variance exceeds the 20-point threshold.
    """
    return CalibrationService.get_org_calibration(db)


@router.get("/{employee_id}", response_model=EmployeeCalibrationResult)
def get_employee_calibration(employee_id: str, db: Session = Depends(get_db)):
    """
    Retrieve evaluation calibration analysis for a specific employee.
    Compares manager rating (normalized to 0-100) with objective evidence score.
    """
    emp = EmployeeRepository.get_employee_by_id(db, employee_id)
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found."
        )

    res = CalibrationService.get_employee_calibration(db, employee_id)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Calibration data could not be computed for '{employee_id}'."
        )
    return res
