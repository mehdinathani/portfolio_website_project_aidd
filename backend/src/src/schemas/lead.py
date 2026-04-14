"""Lead Pydantic schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class LeadCreate(BaseModel):
    """Lead creation request (contact form / chatbot capture)."""

    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    message: str = Field(..., min_length=1)
    category: str = Field(default="other", pattern="^(job_offer|freelance|collaboration|chatbot_capture|other)$")
    source: str = Field(default="contact_form", pattern="^(contact_form|chatbot)$")


class LeadResponse(BaseModel):
    """Lead response with all fields."""

    id: UUID
    name: str
    email: str
    message: str
    category: str
    status: str
    source: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class LeadStatusUpdate(BaseModel):
    """Lead status update request (admin only)."""

    status: str = Field(..., pattern="^(new|reviewed|replied|archived)$")
