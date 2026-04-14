"""Projects endpoints — GET /api/v1/projects."""

from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status

from src.services.project_service import get_projects, get_project_by_id

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("")
async def read_projects(
    featured: Optional[bool] = Query(None, description="Filter featured projects only"),
):
    """List all projects (optionally featured only)."""
    projects = await get_projects(featured_only=featured is True)
    return projects


@router.get("/{project_id}")
async def read_project(project_id: str):
    """Get a single project by ID with its skills."""
    project = await get_project_by_id(project_id)
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found.",
        )
    return project
