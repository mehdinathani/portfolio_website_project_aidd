"""Profile endpoint — GET /api/v1/profile."""

from fastapi import APIRouter, HTTPException, status

from src.services.profile_service import get_profile

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("")
async def read_profile():
    """Get Mehdi's profile information."""
    profile = await get_profile()
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please seed the database with profile data.",
        )
    return profile
