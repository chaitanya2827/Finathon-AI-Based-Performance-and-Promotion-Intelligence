"""
Skill model definition.
"""

from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # Relationships
    role_requirements = relationship("RoleRequiredSkill", back_populates="skill")
    employee_skills = relationship("EmployeeSkill", back_populates="skill")
