"""Gemini API client — chat completions and embeddings using Google Generative AI."""

import logging
from typing import List, Optional, Dict, Any

import httpx
from google import genai
from google.genai import types

from src.config import get_settings

logger = logging.getLogger("portfolio.gemini")

# Chat model configuration
CHAT_MODEL = "gemini-1.5-flash"
EMBEDDING_MODEL = "models/text-embedding-004"

# Chat response JSON schema for structured output
CHAT_RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "response": {
            "type": "STRING",
            "description": "The chatbot's answer (max 500 chars)",
        },
        "lead_intent": {
            "type": "BOOLEAN",
            "description": "True if the user expresses interest in hiring or contacting Mehdi",
        },
        "lead_prompt": {
            "type": "STRING",
            "description": "Optional message to collect contact info (only if lead_intent is true)",
        },
        "sources": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "source": {"type": "STRING", "description": "Source type (project, bio, career_narrative, etc.)"},
                    "similarity": {"type": "NUMBER", "description": "Cosine similarity score"},
                },
                "required": ["source", "similarity"],
            },
            "description": "Knowledge sources used to generate the response",
        },
        "fallback": {
            "type": "BOOLEAN",
            "description": "True if no relevant context was found",
        },
    },
    "required": ["response", "lead_intent", "sources", "fallback"],
}


class GeminiService:
    """Client for Gemini chat completions and text embeddings."""

    def __init__(self):
        settings = get_settings()
        self.api_key = settings.gemini_api_key
        self._client: Optional[genai.Client] = None

    @property
    def client(self) -> genai.Client:
        """Lazy-initialized Gemini client."""
        if self._client is None:
            self._client = genai.Client(api_key=self.api_key)
        return self._client

    async def generate_embedding(self, text: str) -> List[float]:
        """Generate a 768-dimension embedding for the given text.

        Uses Gemini text-embedding-004 model.
        """
        try:
            result = self.client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=text,
            )
            return result.embeddings[0].values
        except Exception as e:
            logger.error("Failed to generate embedding: %s", str(e))
            raise

    async def generate_chat_response(
        self,
        prompt: str,
        history: Optional[List[Dict[str, str]]] = None,
    ) -> Dict[str, Any]:
        """Generate a structured chat response using Gemini 1.5 Flash with JSON mode.

        Returns a dict matching CHAT_RESPONSE_SCHEMA.
        """
        history = history or []

        # Build content parts
        contents = []
        for msg in history:
            role = "model" if msg["role"] == "assistant" else "user"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg["content"])],
                )
            )
        # Add the current user message
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=prompt)],
            )
        )

        try:
            response = self.client.models.generate_content(
                model=CHAT_MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=CHAT_RESPONSE_SCHEMA,
                    temperature=0.3,
                    max_output_tokens=500,
                ),
            )

            import json
            return json.loads(response.text)

        except httpx.TimeoutException:
            logger.error("Gemini API timeout")
            return {
                "response": "Mehdi's assistant is temporarily unavailable. Please use the contact form.",
                "lead_intent": False,
                "sources": [],
                "fallback": True,
            }
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                logger.error("Gemini API rate limit exceeded")
                return {
                    "response": "I'm getting a lot of questions right now! Please try again in a minute, or use the contact form.",
                    "lead_intent": False,
                    "sources": [],
                    "fallback": True,
                }
            logger.error("Gemini API error: %s", str(e))
            raise
        except Exception as e:
            logger.error("Unexpected error generating chat response: %s", str(e))
            raise


# Singleton instance
gemini_service = GeminiService()
