from fastapi import APIRouter, HTTPException, status
from src.schemas.skill import SkillCreate, SkillUpdate, SkillResponse
from src.db.session import get_supabase

router = APIRouter(prefix="/skills", tags=["Admin Skills"])


@router.post("/", response_model=SkillResponse)
async def create_skill(data: SkillCreate):
    supabase = get_supabase()
    result = supabase.table("skills").insert(data.model_dump(exclude_none=True)).execute()
    return SkillResponse(**result.data[0])


@router.put("/{skill_id}", response_model=SkillResponse)
async def update_skill(skill_id: str, data: SkillUpdate):
    supabase = get_supabase()
    result = supabase.table("skills").update(data.model_dump(exclude_none=True)).eq("id", skill_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Skill not found")
    return SkillResponse(**result.data[0])


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(skill_id: str):
    supabase = get_supabase()
    supabase.table("skills").delete().eq("id", skill_id).execute()
