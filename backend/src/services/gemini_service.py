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
    client = _get_client()
    result = client.models.embed_content(
        model="models/text-embedding-004",
        contents=text,
        task_type="retrieval_document",
    )
    return result.embeddings[0].values


def generate_chat_response(prompt: str, history: Optional[List[Dict]] = None) -> Dict:
    client = _get_client()
    model = client.models.get("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return {"response": response.text}
