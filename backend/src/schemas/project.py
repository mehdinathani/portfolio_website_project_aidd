from pydantic import BaseModel
from datetime import date, datetime
from uuid import UUID
from typing import List, Optional


class ProjectResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool = False
    order_index: int = 0
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool = False
    order_index: int = 0
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: Optional[bool] = None
    order_index: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
