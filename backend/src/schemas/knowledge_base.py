from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, Dict, Any


class KnowledgeBaseResponse(BaseModel):
    id: UUID
    content: str
    source: Optional[str] = None
    source_id: Optional[UUID] = None
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class KnowledgeBaseCreate(BaseModel):
    content: str
    source: Optional[str] = None
    source_id: Optional[UUID] = None
    metadata: Optional[Dict[str, Any]] = None


class KnowledgeBaseUpdate(BaseModel):
    content: Optional[str] = None
    source: Optional[str] = None
    source_id: Optional[UUID] = None
    metadata: Optional[Dict[str, Any]] = None
