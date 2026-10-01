"""
Goal model definition.
"""

from sqlalchemy import Column, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    target_value = Column(Float, nullable=False)
    achieved_value = Column(Float, nullable=False)
    metric_unit = Column(String, nullable=False)
    progress_pct = Column(Float, nullable=False)
    verification_evidence = Column(Text, nullable=False)

    # Relationships
    employee = relationship("Employee", back_populates="goals")
