from typing import List, Dict, Optional
from src.config import settings
from google.genai.types import GenerateContentConfig

_client = None


def _get_client():
    global _client
    if _client is None:
        from google import genai
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


def generate_embedding(text: str) -> List[float]:
    try:
        client = _get_client()
        result = client.models.embed_content(
            model="gemini-embedding-001",
            contents=text,
        )
        return result.embeddings[0].values
    except Exception as e:
        raise RuntimeError(f"Embedding generation failed: {e}")


def generate_chat_response(system_prompt: str, user_message: str) -> Dict:
    try:
        client = _get_client()
        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=user_message,
            config=GenerateContentConfig(
                systemInstruction=system_prompt,
                temperature=0.3,
            ),
        )
        text = response.text.strip()
        # Strip markdown fences if present
        if text.startswith("```"):
            text = text.strip("`").strip()
            if text.startswith("json\n"):
                text = text[4:].strip()
        # Try to parse JSON response from model
        if text.startswith("{"):
            import json
            try:
                parsed = json.loads(text)
                return {
                    "response": parsed.get("response", text),
                    "lead_intent": parsed.get("lead_intent", False),
                    "lead_prompt": parsed.get("lead_prompt"),
                    "sources": parsed.get("sources", []),
                    "fallback": parsed.get("fallback", False),
                }
            except json.JSONDecodeError:
                pass
        return {"response": text}
    except Exception as e:
        raise RuntimeError(f"Chat response generation failed: {e}")
