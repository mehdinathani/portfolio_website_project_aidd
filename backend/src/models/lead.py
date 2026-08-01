from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID, ENUM
from .base import BaseModel
import enum


class LeadStatus(enum.Enum):
    new = "new"
    reviewed = "reviewed"
    replied = "replied"
    archived = "archived"


class LeadCategory(enum.Enum):
    general = "general"
    collaboration = "collaboration"
    job_inquiry = "job_inquiry"
    chatbot_capture = "chatbot_capture"


class Lead(BaseModel):
    __tablename__ = "leads"

    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(String, nullable=False)
    category = Column(String)
    status = Column(String, default="new")
    source = Column(String)
