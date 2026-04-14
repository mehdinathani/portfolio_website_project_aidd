"""Experience service — fetch experience entries."""

from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.experience import Experience
from src.schemas.experience import ExperienceResponse


async def get_experience(db: AsyncSession) -> List[ExperienceResponse]:
    """Fetch all experience entries ordered by start_date descending."""
    stmt = select(Experience).order_by(Experience.start_date.desc(), Experience.order_index.asc())
    result = await db.execute(stmt)
    entries = result.scalars().all()
    return [ExperienceResponse.model_validate(e) for e in entries]
