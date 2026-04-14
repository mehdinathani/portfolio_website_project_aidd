"""Skill service — fetch skills, optionally grouped by category."""

from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from collections import defaultdict

from src.models.skill import Skill
from src.schemas.skill import SkillResponse, SkillGroupedResponse, SkillsGroupedList


async def get_skills(db: AsyncSession) -> List[SkillResponse]:
    """Fetch all skills ordered by category and order_index."""
    stmt = select(Skill).order_by(Skill.category.asc(), Skill.order_index.asc())
    result = await db.execute(stmt)
    skills = result.scalars().all()
    return [SkillResponse.model_validate(s) for s in skills]


async def get_skills_grouped_by_category(db: AsyncSession) -> SkillsGroupedList:
    """Fetch skills grouped by their category."""
    stmt = select(Skill).order_by(Skill.category.asc(), Skill.order_index.asc())
    result = await db.execute(stmt)
    skills = result.scalars().all()

    grouped = defaultdict(list)
    for skill in skills:
        grouped[skill.category].append(SkillResponse.model_validate(skill))

    groups = [
        SkillGroupedResponse(category=category, skills=skills_list)
        for category, skills_list in grouped.items()
    ]
    return SkillsGroupedList(groups=groups)
