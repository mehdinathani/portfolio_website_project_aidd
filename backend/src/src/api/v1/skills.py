"""Skills endpoint — GET /api/v1/skills."""

from typing import Optional

from fastapi import APIRouter, Query

from src.services.skill_service import get_skills, get_skills_grouped_by_category

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("")
async def read_skills(
    grouped: Optional[bool] = Query(False, description="Return skills grouped by category"),
):
    """List all skills, optionally grouped by category."""
    if grouped:
        return await get_skills_grouped_by_category()
    return await get_skills()
