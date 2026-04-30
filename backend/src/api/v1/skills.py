from fastapi import APIRouter
from src.schemas.skill import SkillResponse, SkillsGroupedResponse
from src.services.skill_service import get_skills, get_skills_grouped_by_category

router = APIRouter()


@router.get("/", response_model=list[SkillResponse])
async def read_skills():
    return get_skills()


@router.get("/grouped", response_model=list[SkillsGroupedResponse])
async def read_skills_grouped():
    return get_skills_grouped_by_category()
