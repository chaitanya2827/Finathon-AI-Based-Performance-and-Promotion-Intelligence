"""
AnalysisResult model definition (Table schema created in Phase 2 for Phase 3 engine population).
"""

from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(String, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False, index=True)
    readiness_level = Column(String, nullable=True)
    strengths = Column(Text, nullable=True)  # JSON-encoded array
    evidence_summary = Column(Text, nullable=True)  # JSON-encoded summary
    missing_requirements = Column(Text, nullable=True)  # JSON-encoded array
    development_actions = Column(Text, nullable=True)  # JSON-encoded array
    calibration_details = Column(Text, nullable=True)  # JSON-encoded details
    generated_at = Column(String, nullable=True)

    # Relationships
    employee = relationship("Employee", back_populates="analysis_results")
