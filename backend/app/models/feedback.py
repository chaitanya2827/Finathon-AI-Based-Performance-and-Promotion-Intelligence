"""
Feedback model definition.
"""

from sqlalchemy import Column, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False, index=True)
    reviewer_type = Column(String, nullable=False)
    rating = Column(Float, nullable=False)
    comments = Column(Text, nullable=False)
    sentiment = Column(String, nullable=False)

    # Relationships
    employee = relationship("Employee", back_populates="feedback")
