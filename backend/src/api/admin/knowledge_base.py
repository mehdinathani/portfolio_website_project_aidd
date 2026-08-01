from fastapi import APIRouter, HTTPException
from src.schemas.knowledge_base import KnowledgeBaseResponse, KnowledgeBaseCreate, KnowledgeBaseUpdate
from src.services.knowledge_base_service import create_entry, update_entry, delete_entry, get_entries
from uuid import UUID

router = APIRouter(prefix="/knowledge-base", tags=["Admin Knowledge Base"])


@router.get("/", response_model=list[KnowledgeBaseResponse])
async def list_knowledge_base():
    return get_entries()


@router.post("/", response_model=KnowledgeBaseResponse)
async def create_kb_entry(data: KnowledgeBaseCreate):
    return create_entry(content=data.content, source=data.source, metadata=data.metadata, source_id=data.source_id)


@router.put("/{entry_id}", response_model=KnowledgeBaseResponse)
async def update_kb_entry(entry_id: str, data: KnowledgeBaseUpdate):
    result = update_entry(entry_id, content=data.content, source=data.source, metadata=data.metadata, source_id=data.source_id)
    if not result:
        raise HTTPException(status_code=404, detail="Entry not found")
    return result


@router.delete("/{entry_id}", status_code=204)
async def delete_kb_entry(entry_id: str):
    delete_entry(entry_id)
