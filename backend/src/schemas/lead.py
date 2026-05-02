from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID
from typing import Optional


class LeadResponse(BaseModel):
    id: UUID
    name: str
    email: str
    message: str
    category: Optional[str] = None
    status: Optional[str] = None
    source: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
    category: Optional[str] = None
    source: Optional[str] = None


class LeadUpdate(BaseModel):
    status: Optional[str] = None


class LeadFilter(BaseModel):
    category: Optional[str] = None
    status: Optional[str] = None
