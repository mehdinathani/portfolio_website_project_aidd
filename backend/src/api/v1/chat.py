from fastapi import APIRouter, HTTPException
from src.schemas.chat import ChatRequest, ChatResponse, SourceRef
from src.services import rag_service
from src.services import gemini_service
from src.services.prompt_builder import build_system_prompt, build_user_message
from src.services.cache_service import cache_service
from hashlib import sha256
from typing import List, Optional

router = APIRouter()


def _cache_key(message: str) -> str:
    return sha256(message.encode()).hexdigest()[:16]


@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # Check cache
    key = _cache_key(request.message)
    cached = cache_service.get(key)
    if cached:
        return cached

    # RAG: retrieve context
    context_chunks = rag_service.retrieve_context(request.message, top_k=5, threshold=0.4)

    # Build prompt with history (handles empty context gracefully)
    history = [m.model_dump() for m in request.history] if request.history else []
    system_prompt = build_system_prompt(context_chunks, history)
    user_message = build_user_message(request.message)

    # Call Gemini
    try:
        result = gemini_service.generate_chat_response(system_prompt, user_message)
    except Exception:
        return ChatResponse(
            response="Mehdi's assistant is temporarily unavailable. Please use the contact form.",
            lead_intent=False,
            fallback=True,
        )

    # Build response with sources
    sources = [
        SourceRef(source=c.get("source", ""), similarity=c.get("similarity", 0.0))
        for c in context_chunks
    ]
    lead_intent = any(
        kw in result.get("response", "").lower()
        for kw in ["hire", "contract", "work together", "job", "collaborate", "project"]
    )
    response = ChatResponse(
        response=result.get("response", ""),
        lead_intent=lead_intent,
        lead_prompt=(
            "I'd love to discuss this further. Please share your contact details."
            if lead_intent else None
        ),
        sources=sources,
        fallback=result.get("fallback", False),
    )

    # Cache the response
    cache_service.set(key, response, ttl=300)

    return response
