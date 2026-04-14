"""Skill Pydantic schemas."""

from datetime import datetime
from typing import List, Optional, Dict
from uuid import UUID

from pydantic import BaseModel


class SkillResponse(BaseModel):
    """Single skill response."""

    id: UUID
    name: str
    category: str
    proficiency: int
    icon_url: Optional[str] = None
    order_index: int
    created_at: datetime

    model_config = {"from_attributes": True}


class SkillGroupedResponse(BaseModel):
    """Skills grouped by category."""

    category: str
    skills: List[SkillResponse]


class SkillsGroupedList(BaseModel):
    """All skills grouped by category."""

    groups: List[SkillGroupedResponse]
