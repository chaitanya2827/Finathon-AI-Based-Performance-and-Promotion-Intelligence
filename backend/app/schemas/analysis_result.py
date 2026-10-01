"""
AnalysisResult Pydantic schemas.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict


class AnalysisResultRead(BaseModel):
    id: str
    employee_id: str
    readiness_level: Optional[str] = None
    strengths: Optional[str] = None
    evidence_summary: Optional[str] = None
    missing_requirements: Optional[str] = None
    development_actions: Optional[str] = None
    calibration_details: Optional[str] = None
    generated_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
