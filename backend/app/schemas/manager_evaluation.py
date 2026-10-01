"""
ManagerEvaluation Pydantic schemas.
"""

from pydantic import BaseModel, ConfigDict


class ManagerEvaluationRead(BaseModel):
    id: str
    employee_id: str
    manager_name: str
    rating: float
    evaluation_cycle: str
    comments: str
    evaluation_date: str

    model_config = ConfigDict(from_attributes=True)
