"""Profile endpoint — GET /api/v1/profile."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.services.profile_service import get_profile

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("")
async def read_profile(db: AsyncSession = Depends(get_db)):
    """Get Mehdi's profile information."""
    profile = await get_profile(db)
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please seed the database with profile data.",
        )
    return profile
