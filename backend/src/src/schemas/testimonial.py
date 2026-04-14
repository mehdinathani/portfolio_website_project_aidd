"""Testimonial Pydantic schemas."""

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class TestimonialResponse(BaseModel):
    """Single testimonial response."""

    id: UUID
    author_name: str
    author_role: str
    author_company: Optional[str] = None
    quote: str
    date: date
    linkedin_url: Optional[str] = None
    order_index: int
    created_at: datetime

    model_config = {"from_attributes": True}
