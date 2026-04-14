"""Experience endpoint — GET /api/v1/experience."""

from fastapi import APIRouter

from src.services.experience_service import get_experience

router = APIRouter(prefix="/experience", tags=["experience"])


@router.get("")
async def read_experience():
    """List all experience entries in reverse chronological order."""
    return await get_experience()
