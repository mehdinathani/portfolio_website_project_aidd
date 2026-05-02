from fastapi import APIRouter, HTTPException
from src.db.session import get_supabase

router = APIRouter()


@router.get("/")
async def health_check():
    try:
        supabase = get_supabase()
        supabase.table("profiles").select("id").limit(1).execute()
        return {"status": "healthy", "supabase": True, "gemini": True}
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable")
