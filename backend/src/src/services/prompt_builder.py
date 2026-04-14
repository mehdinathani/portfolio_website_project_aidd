"""Prompt construction service for RAG chatbot."""

import json
from typing import List, Dict
from src.services.rag_service import SourceRef


def build_system_prompt(
    context_chunks: List[SourceRef],
    history: List[Dict[str, str]] = None,
) -> str:
    """Construct a system prompt that includes role definition, retrieved context, and constraints.

    This prompt instructs Gemini to:
    1. Answer questions about Mehdi's background, skills, projects, and career
    2. Only use the provided context (grounding constraint)
    3. Detect lead intent (user wants to hire Mehdi)
    4. Return structured JSON output
    """
    history = history or []

    # Build context section
    context_section = ""
    if context_chunks:
        context_section = "\n\n**Retrieved Context:**\n"
        for i, chunk in enumerate(context_chunks, 1):
            context_section += (
                f"\n{i}. [{chunk.source}] (similarity: {chunk.similarity:.2f})\n"
                f"   {chunk.content}"
            )
    else:
        context_section = "\n\n**Retrieved Context:** None available. Use general knowledge about Mehdi if possible, but indicate this is not from the portfolio database."

    # Build history section
    history_section = ""
    if history:
        history_section = "\n\n**Conversation History:**\n"
        for msg in history[-5:]:  # Last 5 messages
            role = "User" if msg.get("role") == "user" else "Assistant"
            history_section += f"{role}: {msg.get('content', '')}\n"

    system_prompt = f"""You are Mehdi's AI portfolio assistant. Answer questions about Mehdi's background, skills, projects, and career transition from finance to tech.

**Role & Behavior:**
- Be helpful, professional, and concise
- Speak in third person (e.g., "Mehdi has experience in...")
- Maximum 500 characters per response
- Only use the provided context to answer. If the answer cannot be found in the context, say you don't have that information and suggest the visitor use the contact form.

**Lead Detection:**
If the user expresses interest in hiring Mehdi, working together, or collaborating, set lead_intent to true and provide a polite prompt to collect their contact info.

**Output Format:**
You MUST return a valid JSON object with these exact fields:
- response: string (your answer, max 500 chars)
- lead_intent: boolean (true if user wants to hire/contact Mehdi)
- lead_prompt: string or null (message to collect contact info, only if lead_intent is true)
- sources: array of objects with {{source: string, similarity: number}}
- fallback: boolean (true if no relevant context was found)

{context_section}

{history_section}

**User Question:** [Will be provided in the user message]

Return ONLY valid JSON. Do not include any other text before or after the JSON object."""

    return system_prompt


def build_fallback_response() -> dict:
    """Build a fallback response when no context is available."""
    return {
        "response": "I don't have specific information about that in Mehdi's portfolio. Please use the contact form to ask Mehdi directly!",
        "lead_intent": False,
        "lead_prompt": None,
        "sources": [],
        "fallback": True,
    }


def extract_lead_intent(response_text: str) -> bool:
    """Simple heuristic to detect if the user wants to hire/contact Mehdi.

    This is a fallback if Gemini doesn't set lead_intent correctly.
    """
    lead_keywords = ["hire", "contact", "work together", "collaborate", "freelance", "job", "offer", "position"]
    return any(keyword in response_text.lower() for keyword in lead_keywords)
