"""
Goal Pydantic schemas.
"""

from pydantic import BaseModel, ConfigDict


class GoalRead(BaseModel):
    id: str
    employee_id: str
    title: str
    category: str
    target_value: float
    achieved_value: float
    metric_unit: str
    progress_pct: float
    verification_evidence: str

    model_config = ConfigDict(from_attributes=True)
