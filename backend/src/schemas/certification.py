from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class CertificationResponse(BaseModel):
    id: str
    name: str
    issuer: Optional[str] = None
    date_earned: Optional[date] = None
    credential_url: Optional[str] = None
    order_index: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CertificationCreate(BaseModel):
    name: str
    issuer: Optional[str] = None
    date_earned: Optional[date] = None
    credential_url: Optional[str] = None
    order_index: int = 0


class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    date_earned: Optional[date] = None
    credential_url: Optional[str] = None
    order_index: Optional[int] = None
