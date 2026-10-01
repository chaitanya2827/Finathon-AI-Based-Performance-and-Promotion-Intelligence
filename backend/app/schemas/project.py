"""
Project Pydantic schemas.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict


class ProjectRead(BaseModel):
    id: str
    employee_id: str
    project_name: str
    role_in_project: str
    deliverables: str
    delivered_on_time: bool
    code_quality_score: Optional[float] = None
    outcome_evidence: str

    model_config = ConfigDict(from_attributes=True)
