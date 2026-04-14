"""Skill service — fetch skills using Supabase REST API, optionally grouped by category."""

from typing import List
from collections import defaultdict
from src.db.session import supabase
from src.schemas.skill import SkillResponse, SkillGroupedResponse, SkillsGroupedList


async def get_skills() -> List[SkillResponse]:
    """Fetch all skills ordered by category and order_index."""
    result = (
        supabase.table("skills")
        .select("*")
        .order("category", desc=False)
        .order("order_index", desc=False)
        .execute()
    )
    return [SkillResponse(**item) for item in result.data]


async def get_skills_grouped_by_category() -> SkillsGroupedList:
    """Fetch skills grouped by their category."""
    result = (
        supabase.table("skills")
        .select("*")
        .order("category", desc=False)
        .order("order_index", desc=False)
        .execute()
    )
    
    grouped = defaultdict(list)
    for skill in result.data:
        grouped[skill["category"]].append(SkillResponse(**skill))
    
    groups = [
        SkillGroupedResponse(category=category, skills=skills_list)
        for category, skills_list in grouped.items()
    ]
    return SkillsGroupedList(groups=groups)
