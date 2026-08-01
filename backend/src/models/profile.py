from sqlalchemy import Column, String
from .base import BaseModel


class Profile(BaseModel):
    __tablename__ = "profiles"

    full_name = Column(String, nullable=False)
    headline = Column(String)
    bio = Column(String)
    email = Column(String)
    phone = Column(String)
    location = Column(String)
    linkedin_url = Column(String)
    github_url = Column(String)
    twitter_url = Column(String)
    resume_url = Column(String)
    profile_image_url = Column(String)
