"""Experience Pydantic schemas."""

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ExperienceResponse(BaseModel):
    """Single experience entry response."""

    id: UUID
    company: str
    role: str
    start_date: date
    end_date: Optional[date] = None
    responsibilities: str
    order_index: int
    created_at: datetime

    model_config = {"from_attributes": True}
