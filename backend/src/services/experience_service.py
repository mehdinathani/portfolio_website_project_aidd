from src.db.session import get_supabase
from src.schemas.experience import ExperienceResponse
from typing import List


def get_experience() -> List[ExperienceResponse]:
    supabase = get_supabase()
    result = supabase.table("experience").select("*").order("order_index").execute()
    return [ExperienceResponse(**e) for e in result.data]
