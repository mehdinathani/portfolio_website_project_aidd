"""Chat Pydantic schemas for RAG-powered chatbot."""

from typing import List, Optional
from pydantic import BaseModel


class SourceRef(BaseModel):
    """Reference to a knowledge source used in the response."""

    source: str
    similarity: float


class ChatRequest(BaseModel):
    """Chat request payload."""

    message: str
    session_id: Optional[str] = None
    history: Optional[List[dict]] = None


class ChatResponse(BaseModel):
    """Structured chat response with lead detection and source attribution."""

    response: str
    lead_intent: bool = False
    lead_prompt: Optional[str] = None
    sources: List[SourceRef] = []
    fallback: bool = False
