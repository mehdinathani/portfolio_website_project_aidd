"""Lead model — contact form submissions and chatbot-captured leads."""

from sqlalchemy import Column, String, Text, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID

from src.models.base import BaseModel, TimestampMixin


class Lead(TimestampMixin, BaseModel):
    __tablename__ = "leads"

    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(30), nullable=False, server_default="other")
    status = Column(String(20), nullable=False, server_default="new")
    source = Column(String(20), nullable=False, server_default="contact_form")

    __table_args__ = (
        CheckConstraint("length(message) > 0", name="chk_leads_message_length"),
        CheckConstraint(
            "category IN ('job_offer', 'freelance', 'collaboration', 'chatbot_capture', 'other')",
            name="chk_leads_category",
        ),
        CheckConstraint(
            "status IN ('new', 'reviewed', 'replied', 'archived')",
            name="chk_leads_status",
        ),
        CheckConstraint(
            "source IN ('contact_form', 'chatbot')",
            name="chk_leads_source",
        ),
    )
