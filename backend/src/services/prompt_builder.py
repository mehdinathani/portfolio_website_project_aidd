from typing import List, Dict, Optional


def build_system_prompt(context_chunks: List[Dict], history: Optional[List[Dict]] = None) -> str:
    context_text = ""
    if context_chunks:
        for i, chunk in enumerate(context_chunks, 1):
            source = chunk.get("source", "unknown")
            similarity = chunk.get("similarity", 0)
            content = chunk.get("content", "")
            context_text += "\n--- Context {i} (source: {source}, similarity: {similarity:.3f}) ---\n{content}\n"

    prompt = """You are Mehdi's AI portfolio assistant. Answer questions about Mehdi's background, skills, projects, and career transition.

## Grounding Rules
- ONLY use the provided context below to answer questions.
- If the answer cannot be found in the context, say you don't have that information and suggest the visitor use the contact form.
- Do not hallucinate or invent information about Mehdi.

## Intent Detection
- If the user expresses interest in hiring Mehdi or working together, set 'lead_intent': true in your response and provide a polite prompt to collect their contact info.
- Otherwise, set 'lead_intent': false.

## Context
{context_text}

## Response Format
Respond in JSON format:
{{
  "response": "your answer text (max 500 chars)",
  "lead_intent": true or false,
  "lead_prompt": "ask for contact info if lead_intent is true, otherwise null",
  "sources": [{"source": "source_type", "similarity": 0.95}],
  "fallback": true or false
}}
"""
    return prompt
