from fastapi import APIRouter
from src.schemas.profile import ProfileResponse
from src.services.profile_service import get_profile

router = APIRouter()


@router.get("/", response_model=ProfileResponse)
async def read_profile():
    profile = get_profile()
    if not profile:
        return {"detail": "Profile not found"}, 404
    return profile
