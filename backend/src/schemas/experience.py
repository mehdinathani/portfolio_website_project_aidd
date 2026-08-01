from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class ExperienceResponse(BaseModel):
    id: str
    company: str
    role: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    responsibilites: Optional[str] = None
    order_index: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class ExperienceCreate(BaseModel):
    company: str
    role: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    responsibilites: Optional[str] = None
    order_index: int = 0


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    responsibilites: Optional[str] = None
    order_index: Optional[int] = None
