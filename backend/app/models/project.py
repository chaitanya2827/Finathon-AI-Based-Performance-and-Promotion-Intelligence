"""
Project model definition.
"""

from sqlalchemy import Column, String, Float, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False, index=True)
    project_name = Column(String, nullable=False)
    role_in_project = Column(String, nullable=False)
    deliverables = Column(Text, nullable=False)
    delivered_on_time = Column(Boolean, default=True, nullable=False)
    code_quality_score = Column(Float, nullable=True)
    outcome_evidence = Column(Text, nullable=False)

    # Relationships
    employee = relationship("Employee", back_populates="projects")
