"""Project Pydantic schemas."""

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class ProjectSkillOut(BaseModel):
    """Nested skill within a project response."""

    id: UUID
    name: str
    category: str
    proficiency: int

    model_config = {"from_attributes": True}


class ProjectResponse(BaseModel):
    """Single project response with skills."""

    id: UUID
    title: str
    description: str
    short_description: str
    tech_stack: List[str]
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool
    order_index: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    created_at: datetime
    updated_at: datetime
    skills: List[ProjectSkillOut] = []

    model_config = {"from_attributes": True}


class ProjectListResponse(BaseModel):
    """Project listing response (without skills to keep payload small)."""

    id: UUID
    title: str
    short_description: str
    tech_stack: List[str]
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool
    order_index: int
    created_at: datetime

    model_config = {"from_attributes": True}
