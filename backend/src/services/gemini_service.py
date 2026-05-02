from typing import List, Dict, Optional
from src.config import settings

_client = None


def _get_client():
    global _client
    if _client is None:
        from google import genai
        genai.configure(api_key=settings.gemini_api_key)
        _client = genai.Client()
    return _client


def generate_embedding(text: str) -> List[float]:
    try:
        client = _get_client()
        result = client.models.embed_content(
            model="models/text-embedding-004",
            contents=text,
            task_type="retrieval_document",
        )
        return result.embeddings[0].values
    except Exception as e:
        raise RuntimeError(f"Embedding generation failed: {e}")


def generate_chat_response(prompt: str, history: Optional[List[Dict]] = None) -> Dict:
    try:
        client = _get_client()
        response = client.models.generate_content(
            model="models/gemini-1.5-flash",
            contents=prompt,
        )
        return {"response": response.text}
    except Exception as e:
        raise RuntimeError(f"Chat response generation failed: {e}")
