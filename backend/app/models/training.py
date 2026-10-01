"""
Training model definition.
"""

from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class Training(Base):
    __tablename__ = "training"

    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False, index=True)
    course_name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    completion_status = Column(String, nullable=False)
    completion_date = Column(String, nullable=True)
    skill_area = Column(String, nullable=False)

    # Relationships
    employee = relationship("Employee", back_populates="training")
