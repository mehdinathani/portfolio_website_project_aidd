from fastapi import APIRouter, HTTPException, status
from src.schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceResponse
from src.db.session import get_supabase

router = APIRouter(prefix="/experience", tags=["Admin Experience"])


@router.post("/", response_model=ExperienceResponse)
async def create_experience(data: ExperienceCreate):
    supabase = get_supabase()
    result = supabase.table("experience").insert(data.model_dump(exclude_none=True)).execute()
    return ExperienceResponse(**result.data[0])


@router.put("/{exp_id}", response_model=ExperienceResponse)
async def update_experience(exp_id: str, data: ExperienceUpdate):
    supabase = get_supabase()
    result = supabase.table("experience").update(data.model_dump(exclude_none=True)).eq("id", exp_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Experience not found")
    return ExperienceResponse(**result.data[0])


@router.delete("/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experience(exp_id: str):
    supabase = get_supabase()
    supabase.table("experience").delete().eq("id", exp_id).execute()
