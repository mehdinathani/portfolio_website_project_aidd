"""Project model with tech stack array."""

from sqlalchemy import ARRAY, Boolean, Column, Date, Integer, String, Text, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID

from src.models.base import BaseModel, TimestampMixin


class Project(TimestampMixin, BaseModel):
    __tablename__ = "projects"

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    short_description = Column(String(300), nullable=False)
    tech_stack = Column(ARRAY(String), nullable=False, server_default="{}")
    project_url = Column(Text, nullable=True)
    github_url = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    featured = Column(Boolean, nullable=False, server_default="false")
    order_index = Column(Integer, nullable=False, server_default="0")
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    __table_args__ = (
        CheckConstraint("order_index >= 0", name="chk_projects_order_index"),
    )
