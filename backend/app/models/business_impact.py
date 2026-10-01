"""
BusinessImpact model definition.
"""

from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class BusinessImpact(Base):
    __tablename__ = "business_impact"

    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False, index=True)
    impact_type = Column(String, nullable=False)
    metric_name = Column(String, nullable=False)
    value = Column(String, nullable=False)
    metric_unit = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)

    # Relationships
    employee = relationship("Employee", back_populates="business_impact")
