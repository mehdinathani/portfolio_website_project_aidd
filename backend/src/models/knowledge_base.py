from sqlalchemy import Column, String, JSON
from sqlalchemy.dialects.postgresql import UUID, vector
from .base import BaseModel


class KnowledgeBase(BaseModel):
    __tablename__ = "knowledge_base"

    content = Column(String, nullable=False)
    source = Column(String)
    source_id = Column(UUID(as_uuid=True))
    embedding = Column(vector(768))
    metadata = Column(JSON)
