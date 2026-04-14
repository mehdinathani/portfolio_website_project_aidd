"""Profile service — fetch profile data using Supabase REST API."""

from typing import Optional
from src.db.session import supabase
from src.schemas.profile import ProfileResponse


async def get_profile() -> Optional[ProfileResponse]:
    """Fetch the single profile row."""
    result = supabase.table("profiles").select("*").limit(1).execute()
    
    if not result.data:
        return None
    
    return ProfileResponse(**result.data[0])
