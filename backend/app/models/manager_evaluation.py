"""
ManagerEvaluation model definition.
"""

from sqlalchemy import Column, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class ManagerEvaluation(Base):
    __tablename__ = "manager_evaluations"

    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False, index=True)
    manager_name = Column(String, nullable=False)
    rating = Column(Float, nullable=False)
    evaluation_cycle = Column(String, nullable=False)
    comments = Column(Text, nullable=False)
    evaluation_date = Column(String, nullable=False)

    # Relationships
    employee = relationship("Employee", back_populates="manager_evaluations")
