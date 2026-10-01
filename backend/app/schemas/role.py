"""
Role Pydantic schemas.
"""

from typing import Optional
from pydantic import BaseModel, ConfigDict


class RoleBase(BaseModel):
    id: str
    name: str
    department: str
    description: Optional[str] = None


class RoleRead(RoleBase):
    model_config = ConfigDict(from_attributes=True)
