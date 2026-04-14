"""Skill and ProjectSkill models."""

from sqlalchemy import Column, ForeignKey, Integer, String, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.models.base import BaseModel, TimestampMixin


class Skill(TimestampMixin, BaseModel):
    __tablename__ = "skills"

    name = Column(String(100), nullable=False, unique=True)
    category = Column(String(50), nullable=False)
    proficiency = Column(Integer, nullable=False)
    icon_url = Column(String, nullable=True)
    order_index = Column(Integer, nullable=False, server_default="0")

    __table_args__ = (
        CheckConstraint("category IN ('Languages', 'Frameworks', 'Libraries', 'Databases', 'Tools', 'Cloud', 'AI/ML')", name="chk_skills_category"),
        CheckConstraint("proficiency BETWEEN 1 AND 5", name="chk_skills_proficiency"),
        CheckConstraint("order_index >= 0", name="chk_skills_order_index"),
    )

    project_skills = relationship("ProjectSkill", back_populates="skill")


class ProjectSkill(BaseModel):
    """Junction table between projects and skills."""

    __tablename__ = "project_skills"

    project_id = Column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    skill_id = Column(
        UUID(as_uuid=True),
        ForeignKey("skills.id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    created_at = Column("created_at", TimestampMixin.created_at.type, nullable=False, server_default=TimestampMixin.created_at.server_default)

    project = relationship("Project", back_populates="project_skills")
    skill = relationship("Skill", back_populates="project_skills")
