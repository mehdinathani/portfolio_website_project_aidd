"""RAG retrieval service — vector similarity search using Supabase match_knowledge RPC."""

import logging
from typing import List, Dict
from src.db.session import supabase
from src.services import gemini_service

logger = logging.getLogger("portfolio.rag")


class SourceRef:
    def __init__(self, source: str, similarity: float, content: str):
        self.source = source
        self.similarity = similarity
        self.content = content


async def retrieve_context(
    query: str,
    top_k: int = 5,
    threshold: float = 0.7
) -> List[SourceRef]:
    """Retrieve relevant context from knowledge base using vector similarity search.

    1. Generate embedding for the query using Gemini
    2. Call Supabase match_knowledge RPC to find similar content
    3. Filter by threshold and return top results
    """
    try:
        # Generate embedding for the query
        embedding = await gemini_service.generate_embedding(query)

        # Call Supabase RPC for vector similarity search
        result = supabase.rpc(
            "match_knowledge",
            {
                "query_embedding": embedding,
                "match_count": top_k,
                "similarity_threshold": threshold,
            }
        ).execute()

        # Build source references
        sources = []
        for row in result.data:
            sources.append(
                SourceRef(
                    source=row.get("source", "unknown"),
                    similarity=row.get("similarity", 0.0),
                    content=row.get("content", ""),
                )
            )

        logger.info(
            "Retrieved %d knowledge chunks for query: %s",
            len(sources),
            query[:50],
        )
        return sources

    except Exception as e:
        logger.error("Failed to retrieve context: %s", str(e))
        raise
