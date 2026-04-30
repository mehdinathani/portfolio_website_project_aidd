from fastapi import APIRouter, Depends, HTTPException, status
from src.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from src.db.session import get_supabase
from uuid import UUID

router = APIRouter(prefix="/projects", tags=["Admin Projects"])


@router.post("/", response_model=ProjectResponse)
async def create_project(data: ProjectCreate):
    supabase = get_supabase()
    result = supabase.table("projects").insert(data.model_dump(exclude_none=True)).execute()
    return ProjectResponse(**result.data[0])


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: str, data: ProjectUpdate):
    supabase = get_supabase()
    result = supabase.table("projects").update(data.model_dump(exclude_none=True)).eq("id", project_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse(**result.data[0])


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str):
    supabase = get_supabase()
    supabase.table("projects").delete().eq("id", project_id).execute()
