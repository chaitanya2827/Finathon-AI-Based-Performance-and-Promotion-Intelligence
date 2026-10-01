"""
Training Pydantic schemas.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict


class TrainingRead(BaseModel):
    id: str
    employee_id: str
    course_name: str
    provider: str
    completion_status: str
    completion_date: Optional[str] = None
    skill_area: str

    model_config = ConfigDict(from_attributes=True)
