from fastapi import APIRouter
from src.schemas.project import ProjectResponse
from src.services.project_service import get_projects, get_project_by_id
from uuid import UUID

router = APIRouter()


@router.get("/", response_model=list[ProjectResponse])
async def read_projects(featured: bool = False):
    return get_projects(featured_only=featured)


@router.get("/{project_id}", response_model=ProjectResponse)
async def read_project(project_id: str):
    project = get_project_by_id(project_id)
    if not project:
        return {"detail": "Project not found"}, 404
    return project
