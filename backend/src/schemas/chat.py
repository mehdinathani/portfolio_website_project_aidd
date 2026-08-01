from pydantic import BaseModel
from typing import List, Optional


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    history: Optional[List[ChatMessage]] = None


class SourceRef(BaseModel):
    source: str
    similarity: float


class ChatResponse(BaseModel):
    response: str
    lead_intent: bool = False
    lead_prompt: Optional[str] = None
    sources: Optional[List[SourceRef]] = None
    fallback: bool = False
