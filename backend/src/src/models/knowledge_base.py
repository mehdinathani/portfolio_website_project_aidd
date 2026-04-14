"""Knowledge Base model — RAG embeddings with pgvector."""

from sqlalchemy import Column, String, Text, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from pgvector.sqlalchemy import Vector

from src.models.base import BaseModel, TimestampMixin


class KnowledgeBase(TimestampMixin, BaseModel):
    __tablename__ = "knowledge_base"

    content = Column(Text, nullable=False)
    source = Column(String(50), nullable=False)
    source_id = Column(UUID(as_uuid=True), nullable=True)
    metadata = Column(JSONB, nullable=False, server_default="{}")
    embedding = Column(Vector(768), nullable=False)

    __table_args__ = (
        CheckConstraint("length(content) BETWEEN 50 AND 2000", name="chk_kb_content_length"),
        CheckConstraint(
            "source IN ('resume', 'project', 'bio', 'skills', 'career_narrative', 'testimonial', 'certification')",
            name="chk_kb_source",
        ),
    )
