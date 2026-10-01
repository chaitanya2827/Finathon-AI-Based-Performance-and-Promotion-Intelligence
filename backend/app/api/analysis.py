"""
ZEROBUGS HRM-05: Analysis Orchestrator API Endpoints.
Provides the master analytics endpoint that coordinates all 6 evaluation engines,
generates explainable AI reasoning, saves results to SQLite, and returns structured data.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database.database import get_db
from backend.app.database.repository import EmployeeRepository
from backend.app.schemas import ComprehensiveAnalysisResult
from backend.app.services.analysis_service import AnalysisOrchestrator

router = APIRouter(tags=["Analysis"])


@router.post("/analyze/{employee_id}", response_model=ComprehensiveAnalysisResult)
def trigger_employee_analysis(employee_id: str, db: Session = Depends(get_db)):
    """
    Execute full end-to-end explainable analytics pipeline for an employee:
    1. Load employee evidence package
    2. Run performance analysis (5 dimensions)
    3. Run skill assessment & gap detection
    4. Run career path recommendation
    5. Run promotion readiness evaluation (4 dimensions)
    6. Run managerial calibration & discrepancy detection
    7. Generate deterministic AI reasoning narrative (offline, no API key required)
    8. Persist structured record to ANALYSIS_RESULTS table
    9. Return frontend-ready comprehensive intelligence payload
    """
    emp = EmployeeRepository.get_employee_by_id(db, employee_id)
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found."
        )

    result = AnalysisOrchestrator.analyze_employee(db, employee_id, persist=True)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to execute analysis pipeline for '{employee_id}'."
        )

    return result


@router.get("/analyze/{employee_id}", response_model=ComprehensiveAnalysisResult)
def get_or_run_employee_analysis(employee_id: str, db: Session = Depends(get_db)):
    """
    Convenience GET endpoint to retrieve or run the complete intelligence analysis for an employee.
    """
    emp = EmployeeRepository.get_employee_by_id(db, employee_id)
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found."
        )

    result = AnalysisOrchestrator.analyze_employee(db, employee_id, persist=True)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve analysis for '{employee_id}'."
        )

    return result
