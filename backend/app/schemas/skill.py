"""
Skill Pydantic schemas.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict


class SkillBase(BaseModel):
    id: str
    name: str
    category: str
    description: Optional[str] = None


class SkillRead(SkillBase):
    model_config = ConfigDict(from_attributes=True)


class EmployeeSkillRead(BaseModel):
    id: str
    employee_id: str
    skill_id: str
    proficiency_level: int
    verification_proof: str
    skill: Optional[SkillRead] = None

    model_config = ConfigDict(from_attributes=True)
