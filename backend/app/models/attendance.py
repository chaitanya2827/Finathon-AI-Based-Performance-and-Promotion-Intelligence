"""
Attendance model definition.
"""

from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False, index=True)
    period = Column(String, nullable=False)
    working_days = Column(Integer, nullable=False)
    days_present = Column(Integer, nullable=False)
    attendance_pct = Column(Float, nullable=False)
    reliability_notes = Column(Text, nullable=True)

    # Relationships
    employee = relationship("Employee", back_populates="attendance")
