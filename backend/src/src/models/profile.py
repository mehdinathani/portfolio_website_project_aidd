"""Profile model — Mehdi's bio and contact info (single-row table)."""

from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import UUID

from src.models.base import BaseModel, TimestampMixin


class Profile(TimestampMixin, BaseModel):
    __tablename__ = "profiles"

    full_name = Column(String(100), nullable=False)
    headline = Column(String(200), nullable=False)
    bio = Column(Text, nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    location = Column(String(100), nullable=True)
    linkedin_url = Column(Text, nullable=True)
    github_url = Column(Text, nullable=True)
    twitter_url = Column(Text, nullable=True)
    resume_url = Column(Text, nullable=True)
    profile_image_url = Column(Text, nullable=True)
