"""
EmployeeSkill model definition.
"""

from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class EmployeeSkill(Base):
    __tablename__ = "employee_skills"

    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False, index=True)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False, index=True)
    proficiency_level = Column(Integer, nullable=False)
    verification_proof = Column(Text, nullable=False)

    # Relationships
    employee = relationship("Employee", back_populates="skills")
    skill = relationship("Skill", back_populates="employee_skills")
