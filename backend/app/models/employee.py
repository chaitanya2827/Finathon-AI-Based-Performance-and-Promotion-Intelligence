"""
Employee model definition.
"""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    department = Column(String, nullable=False, index=True)
    current_role_id = Column(String, ForeignKey("roles.id"), nullable=False)
    target_role_id = Column(String, ForeignKey("roles.id"), nullable=False)
    manager_id = Column(String, ForeignKey("employees.employee_id"), nullable=True)
    hire_date = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)

    # Role Relationships
    current_role = relationship("Role", foreign_keys=[current_role_id])
    target_role = relationship("Role", foreign_keys=[target_role_id])

    # Manager self-reference relationship
    manager = relationship("Employee", remote_side=[employee_id], foreign_keys=[manager_id])

    # Evidence Relationships
    goals = relationship("Goal", back_populates="employee", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="employee", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="employee", cascade="all, delete-orphan")
    skills = relationship("EmployeeSkill", back_populates="employee", cascade="all, delete-orphan")
    training = relationship("Training", back_populates="employee", cascade="all, delete-orphan")
    attendance = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")
    business_impact = relationship("BusinessImpact", back_populates="employee", cascade="all, delete-orphan")
    manager_evaluations = relationship("ManagerEvaluation", back_populates="employee", cascade="all, delete-orphan")
    analysis_results = relationship("AnalysisResult", back_populates="employee", cascade="all, delete-orphan")
