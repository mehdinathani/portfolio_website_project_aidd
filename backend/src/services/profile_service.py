from src.db.session import get_supabase
from src.schemas.profile import ProfileResponse
from typing import Optional


def get_profile() -> Optional[ProfileResponse]:
    supabase = get_supabase()
    result = supabase.table("profiles").select("*").limit(1).execute()
    if not result.data:
        return None
    return ProfileResponse(**result.data[0])
