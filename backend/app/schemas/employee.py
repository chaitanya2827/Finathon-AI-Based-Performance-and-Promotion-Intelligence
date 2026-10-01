"""
Employee Pydantic schemas.
"""

from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from backend.app.schemas.role import RoleRead
from backend.app.schemas.goal import GoalRead
from backend.app.schemas.project import ProjectRead
from backend.app.schemas.feedback import FeedbackRead
from backend.app.schemas.skill import EmployeeSkillRead
from backend.app.schemas.training import TrainingRead
from backend.app.schemas.attendance import AttendanceRead
from backend.app.schemas.business_impact import BusinessImpactRead
from backend.app.schemas.manager_evaluation import ManagerEvaluationRead


class EmployeeBase(BaseModel):
    employee_id: str
    name: str
    email: str
    department: str
    current_role_id: str
    target_role_id: str
    manager_id: Optional[str] = None
    hire_date: str
    avatar_url: Optional[str] = None


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeRead(EmployeeBase):
    id: int
    current_role: Optional[RoleRead] = None
    target_role: Optional[RoleRead] = None

    model_config = ConfigDict(from_attributes=True)


class EmployeeEvidencePackage(BaseModel):
    goals: List[GoalRead]
    projects: List[ProjectRead]
    feedback: List[FeedbackRead]
    skills: List[EmployeeSkillRead]
    training: List[TrainingRead]
    attendance: List[AttendanceRead]
    business_impact: List[BusinessImpactRead]
    manager_evaluations: List[ManagerEvaluationRead]

    model_config = ConfigDict(from_attributes=True)


class EmployeeEvidenceRead(BaseModel):
    employee_id: str
    name: str
    department: str
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    evidence: EmployeeEvidencePackage

    model_config = ConfigDict(from_attributes=True)
