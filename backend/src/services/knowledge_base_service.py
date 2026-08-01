from src.db.session import get_supabase
from src.services import gemini_service
from src.schemas.knowledge_base import KnowledgeBaseCreate, KnowledgeBaseResponse, KnowledgeBaseUpdate
from typing import List, Optional
from uuid import UUID


def create_entry(content: str, source: str, metadata: Optional[dict] = None, source_id: Optional[UUID] = None) -> KnowledgeBaseResponse:
    supabase = get_supabase()
    embedding = gemini_service.generate_embedding(content)
    data = {
        "content": content,
        "source": source,
        "metadata": metadata,
        "source_id": str(source_id) if source_id else None,
        "embedding": embedding,
    }
    result = supabase.table("knowledge_base").insert(data).execute()
    return KnowledgeBaseResponse(**result.data[0])


def update_entry(entry_id: str, content: Optional[str] = None, source: Optional[str] = None,
                metadata: Optional[dict] = None, source_id: Optional[UUID] = None) -> Optional[KnowledgeBaseResponse]:
    supabase = get_supabase()
    update_data = {}
    if content is not None:
        update_data["content"] = content
        update_data["embedding"] = gemini_service.generate_embedding(content)
    if source is not None:
        update_data["source"] = source
    if metadata is not None:
        update_data["metadata"] = metadata
    if source_id is not None:
        update_data["source_id"] = str(source_id)
    result = supabase.table("knowledge_base").update(update_data).eq("id", entry_id).execute()
    if not result.data:
        return None
    return KnowledgeBaseResponse(**result.data[0])


def delete_entry(entry_id: str) -> bool:
    supabase = get_supabase()
    result = supabase.table("knowledge_base").delete().eq("id", entry_id).execute()
    return len(result.data) > 0


def get_entries() -> List[KnowledgeBaseResponse]:
    supabase = get_supabase()
    result = supabase.table("knowledge_base").select("*").order("created_at", desc=True).execute()
    return [KnowledgeBaseResponse(**e) for e in result.data]
