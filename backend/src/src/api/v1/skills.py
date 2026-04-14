"""Skills endpoint — GET /api/v1/skills."""

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.services.skill_service import get_skills, get_skills_grouped_by_category

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("")
async def read_skills(
    grouped: Optional[bool] = Query(False, description="Return skills grouped by category"),
    db: AsyncSession = Depends(get_db),
):
    """List all skills, optionally grouped by category."""
    if grouped:
        return await get_skills_grouped_by_category(db)
    return await get_skills(db)
