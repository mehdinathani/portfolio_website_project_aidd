"""Experience endpoint — GET /api/v1/experience."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.services.experience_service import get_experience

router = APIRouter(prefix="/experience", tags=["experience"])


@router.get("")
async def read_experience(db: AsyncSession = Depends(get_db)):
    """List all experience entries in reverse chronological order."""
    return await get_experience(db)
