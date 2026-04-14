"""Certification model — professional certifications."""

from sqlalchemy import Column, Date, Integer, String, Text, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID

from src.models.base import BaseModel, TimestampMixin


class Certification(TimestampMixin, BaseModel):
    __tablename__ = "certifications"

    name = Column(String(200), nullable=False)
    issuer = Column(String(200), nullable=False)
    date_earned = Column(Date, nullable=False)
    credential_url = Column(Text, nullable=True)
    order_index = Column(Integer, nullable=False, server_default="0")

    __table_args__ = (
        CheckConstraint("order_index >= 0", name="chk_certifications_order_index"),
    )
