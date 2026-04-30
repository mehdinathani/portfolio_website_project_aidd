from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class TestimonialResponse(BaseModel):
    id: str
    author_name: str
    author_role: Optional[str] = None
    author_company: Optional[str] = None
    quote: str
    linkedin_url: Optional[str] = None
    date: Optional[date] = None
    order_index: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TestimonialCreate(BaseModel):
    author_name: str
    author_role: Optional[str] = None
    author_company: Optional[str] = None
    quote: str
    linkedin_url: Optional[str] = None
    date: Optional[date] = None
    order_index: int = 0


class TestimonialUpdate(BaseModel):
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    author_company: Optional[str] = None
    quote: Optional[str] = None
    linkedin_url: Optional[str] = None
    date: Optional[date] = None
    order_index: Optional[int] = None
