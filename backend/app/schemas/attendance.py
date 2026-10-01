"""
Attendance Pydantic schemas.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict


class AttendanceRead(BaseModel):
    id: str
    employee_id: str
    period: str
    working_days: int
    days_present: int
    attendance_pct: float
    reliability_notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
