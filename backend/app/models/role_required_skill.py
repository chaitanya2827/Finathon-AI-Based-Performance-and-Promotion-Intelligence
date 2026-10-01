"""
RoleRequiredSkill model definition.
"""

from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class RoleRequiredSkill(Base):
    __tablename__ = "role_required_skills"

    id = Column(String, primary_key=True, index=True)
    role_id = Column(String, ForeignKey("roles.id"), nullable=False, index=True)
    skill_id = Column(String, ForeignKey("skills.id"), nullable=False, index=True)
    required_level = Column(Integer, nullable=False)
    is_mandatory = Column(Boolean, default=True, nullable=False)

    # Relationships
    role = relationship("Role", back_populates="requirements")
    skill = relationship("Skill", back_populates="role_requirements")
