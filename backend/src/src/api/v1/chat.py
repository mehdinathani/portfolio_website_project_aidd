"""Chat endpoint — POST /api/v1/chat with full RAG pipeline."""

import hashlib
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, status

from src.schemas.chat import ChatRequest, ChatResponse, SourceRef
from src.services import rag_service, prompt_builder, gemini_service
from src.services.cache_service import cache_service

router = APIRouter(prefix="/chat", tags=["chat"])

logger = logging.getLogger("portfolio.chat")


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """POST /api/v1/chat — RAG-powered chatbot with Gemini 1.5 Flash.

    Flow:
    1. Check cache for identical query
    2. Apply rate limiting (via middleware)
    3. Retrieve context from knowledge base via vector similarity
    4. Build system prompt with context
    5. Generate structured response with Gemini
    6. Cache successful response
    7. Return response with lead detection and source attribution
    """
    try:
        # Check cache
        cache_key = hashlib.md5(request.message.encode()).hexdigest()
        cached = cache_service.get(cache_key)
        if cached:
            logger.info("Cache hit for chat query")
            return cached

        # Retrieve context from knowledge base
        try:
            context_chunks = await rag_service.retrieve_context(
                query=request.message,
                top_k=5,
                threshold=0.7,
            )
        except Exception as e:
            logger.error("RAG retrieval failed: %s", str(e))
            # Return fallback if RAG fails
            fallback = prompt_builder.build_fallback_response()
            return ChatResponse(**fallback)

        # Build system prompt
        system_prompt = prompt_builder.build_system_prompt(
            context_chunks=context_chunks,
            history=request.history or [],
        )

        # Generate response with Gemini
        try:
            gemini_response = await gemini_service.generate_chat_response(
                prompt=system_prompt,
                history=request.history or [],
            )
        except Exception as e:
            logger.error("Gemini API call failed: %s", str(e))
            # Return fallback if Gemini fails
            fallback = prompt_builder.build_fallback_response()
            return ChatResponse(**fallback)

        # Validate response structure
        if not isinstance(gemini_response, dict):
            logger.error("Invalid Gemini response type")
            fallback = prompt_builder.build_fallback_response()
            return ChatResponse(**fallback)

        # Build sources from context chunks
        sources = []
        for chunk in context_chunks:
            sources.append(
                SourceRef(
                    source=chunk.source,
                    similarity=chunk.similarity,
                )
            )

        # Build final response
        response = ChatResponse(
            response=gemini_response.get("response", ""),
            lead_intent=gemini_response.get("lead_intent", False),
            lead_prompt=gemini_response.get("lead_prompt"),
            sources=sources,
            fallback=gemini_response.get("fallback", False),
        )

        # Cache successful response
        cache_service.set(cache_key, response, ttl=300)  # 5 minutes

        logger.info(
            "Chat response generated: lead_intent=%s, sources=%d",
            response.lead_intent,
            len(response.sources),
        )
        return response

    except Exception as e:
        logger.error("Unexpected error in chat endpoint: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error processing chat request.",
        )
