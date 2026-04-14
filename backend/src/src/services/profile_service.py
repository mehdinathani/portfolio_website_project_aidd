"""Profile service — fetch profile data."""

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.profile import Profile
from src.schemas.profile import ProfileResponse


async def get_profile(db: AsyncSession) -> Optional[ProfileResponse]:
    """Fetch the single profile row."""
    stmt = select(Profile).limit(1)
    result = await db.execute(stmt)
    profile = result.scalar_one_or_none()
    if profile is None:
        return None
    return ProfileResponse.model_validate(profile)
