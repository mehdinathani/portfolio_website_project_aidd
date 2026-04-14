"""Experience service — fetch experience entries using Supabase REST API."""

from typing import List
from src.db.session import supabase
from src.schemas.experience import ExperienceResponse


async def get_experience() -> List[ExperienceResponse]:
    """Fetch all experience entries ordered by start_date descending."""
    result = (
        supabase.table("experience")
        .select("*")
        .order("start_date", desc=True)
        .order("order_index", desc=False)
        .execute()
    )
    return [ExperienceResponse(**item) for item in result.data]
