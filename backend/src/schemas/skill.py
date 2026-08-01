from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class SkillResponse(BaseModel):
    id: str
    name: str
    category: str
    proficiency: Optional[int] = None
    order_index: int = 0

    class Config:
        from_attributes = True


class SkillsGroupedResponse(BaseModel):
    category: str
    skills: List[SkillResponse]


class SkillCreate(BaseModel):
    name: str
    category: str
    proficiency: Optional[int] = None
    order_index: int = 0


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    proficiency: Optional[int] = None
    order_index: Optional[int] = None
