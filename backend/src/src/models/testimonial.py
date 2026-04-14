"""Testimonial model — professional recommendations."""

from sqlalchemy import Column, Date, Integer, String, Text, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID

from src.models.base import BaseModel, TimestampMixin


class Testimonial(TimestampMixin, BaseModel):
    __tablename__ = "testimonials"

    author_name = Column(String(100), nullable=False)
    author_role = Column(String(100), nullable=False)
    author_company = Column(String(100), nullable=True)
    quote = Column(Text, nullable=False)
    date = Column(Date, nullable=False)
    linkedin_url = Column(Text, nullable=True)
    order_index = Column(Integer, nullable=False, server_default="0")

    __table_args__ = (
        CheckConstraint("length(quote) > 0", name="chk_testimonials_quote_length"),
        CheckConstraint("date <= CURRENT_DATE", name="chk_testimonials_date"),
        CheckConstraint("order_index >= 0", name="chk_testimonials_order_index"),
    )
