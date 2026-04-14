"""Experience model — work history timeline."""

from sqlalchemy import Column, Date, Integer, String, Text, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID

from src.models.base import BaseModel, TimestampMixin


class Experience(TimestampMixin, BaseModel):
    __tablename__ = "experience"

    company = Column(String(200), nullable=False)
    role = Column(String(200), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    responsibilities = Column(Text, nullable=False)
    order_index = Column(Integer, nullable=False, server_default="0")

    __table_args__ = (
        CheckConstraint("order_index >= 0", name="chk_experience_order_index"),
    )
