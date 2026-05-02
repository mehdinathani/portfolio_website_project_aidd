from fastapi import APIRouter, HTTPException
from src.schemas.profile import ProfileResponse
from src.services.profile_service import get_profile

router = APIRouter()


@router.get("/", response_model=ProfileResponse)
async def read_profile():
    profile = get_profile()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
