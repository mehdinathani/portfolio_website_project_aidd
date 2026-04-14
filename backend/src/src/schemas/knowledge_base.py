"""Knowledge Base Pydantic schemas."""

from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

from pydantic import BaseModel


class KnowledgeBaseResponse(BaseModel):
    """Knowledge base entry response (without embedding vector)."""

    id: UUID
    content: str
    source: str
    source_id: Optional[UUID] = None
    metadata: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
