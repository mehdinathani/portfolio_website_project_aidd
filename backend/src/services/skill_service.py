from src.db.session import get_supabase
from src.schemas.skill import SkillResponse, SkillsGroupedResponse
from typing import List
from collections import defaultdict


def get_skills() -> List[SkillResponse]:
    supabase = get_supabase()
    result = supabase.table("skills").select("*").order("order_index").execute()
    return [SkillResponse(**s) for s in result.data]


def get_skills_grouped_by_category() -> List[SkillsGroupedResponse]:
    supabase = get_supabase()
    result = supabase.table("skills").select("*").order("order_index").execute()
    grouped = defaultdict(list)
    for s in result.data:
        grouped[s["category"]].append(SkillResponse(**s))
    return [SkillsGroupedResponse(category=cat, skills=skills) for cat, skills in grouped.items()]
