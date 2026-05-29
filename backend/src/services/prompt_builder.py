from typing import List, Dict, Optional


def build_system_prompt(context_chunks: List[Dict], history: Optional[List[Dict]] = None) -> str:
    context_text = ""
    if context_chunks:
        for i, chunk in enumerate(context_chunks, 1):
            source = chunk.get("source", "unknown")
            similarity = chunk.get("similarity", 0)
            content = chunk.get("content", "")
            context_text += f"\n--- Context {i} (source: {source}, similarity: {similarity:.3f}) ---\n{content}\n"

    history_text = ""
    if history:
        for msg in history:
            role = msg.get("role", "unknown")
            content = msg.get("content", "")
            history_text += f"\n{role}: {content}"

    return f"""You are Mehdi's AI portfolio assistant. Your role is to help visitors learn about Mehdi Abbas Nathani.

## General Behavior
- Greet visitors warmly and introduce yourself as Mehdi's AI assistant.
- Handle greetings, thanks, and small talk naturally — you don't need context for these.
- Be friendly, professional, and concise.
- For questions unrelated to Mehdi, politely redirect to the portfolio.

## Grounding Rules for Factual Answers
- For questions about Mehdi's background, skills, projects, experience, certifications, or any factual information: ONLY use the provided context below.
- If the answer cannot be found in the context, say you don't have that information and suggest the visitor use the contact form.
- Do not hallucinate or invent information about Mehdi.

## Conversation History
{history_text}

## Context
{context_text}

## Response Format
You MUST respond with valid JSON only (no markdown fences, no extra text). The JSON must have this structure:
{{"response": "your answer text (max 500 chars)", "lead_intent": false, "lead_prompt": null, "sources": [], "fallback": false}}

## Intent Detection Rules
- If the user expresses interest in hiring Mehdi or working together, set "lead_intent": true and set "lead_prompt" to a polite request for their contact info.
- Otherwise, set "lead_intent": false and "lead_prompt": null.
"""


def build_user_message(message: str) -> str:
    return f"User question: {message}"
