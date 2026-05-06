from src.db.session import get_supabase
from src.services import gemini_service
from typing import List, Dict

def retrieve_context(query: str, top_k: int = 5, threshold: float = 0.7) -> List[Dict]:
    try:
        embedding = gemini_service.generate_embedding(query)
    except Exception:
        return []
    try:
        supabase = get_supabase()
        result = supabase.rpc("match_knowledge", {
            "query_embedding": embedding,
            "match_count": top_k,
            "similarity_threshold": threshold,
        }).execute()
        return result.data or []
    except Exception as e:
        print(f"RAG retrieval error: {e}")
        return []
