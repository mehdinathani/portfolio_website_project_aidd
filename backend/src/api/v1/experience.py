from fastapi import APIRouter
from src.schemas.experience import ExperienceResponse
from src.services.experience_service import get_experience

router = APIRouter()


@router.get("/", response_model=list[ExperienceResponse])
async def read_experience():
    return get_experience()
