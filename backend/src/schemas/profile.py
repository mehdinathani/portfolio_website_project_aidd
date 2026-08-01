from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class ProfileResponse(BaseModel):
    id: UUID
    full_name: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    resume_url: Optional[str] = None
    profile_image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
