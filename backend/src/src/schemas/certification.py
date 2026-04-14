"""Certification Pydantic schemas."""

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class CertificationResponse(BaseModel):
    """Single certification response."""

    id: UUID
    name: str
    issuer: str
    date_earned: date
    credential_url: Optional[str] = None
    order_index: int
    created_at: datetime

    model_config = {"from_attributes": True}
