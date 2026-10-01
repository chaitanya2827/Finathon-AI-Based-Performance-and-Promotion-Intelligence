"""
Role model definition.
"""

from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from backend.app.database.base import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # Relationships
    requirements = relationship("RoleRequiredSkill", back_populates="role", cascade="all, delete-orphan")
