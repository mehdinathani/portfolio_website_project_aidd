"""Project service — fetch projects with optional skill joins."""

from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.models.project import Project
from src.models.skill import ProjectSkill, Skill
from src.schemas.project import ProjectListResponse, ProjectResponse, ProjectSkillOut


async def get_projects(db: AsyncSession, featured_only: bool = False) -> List[ProjectListResponse]:
    """Fetch all projects (optionally featured only), ordered by order_index."""
    stmt = (
        select(Project)
        .order_by(Project.order_index.asc(), Project.created_at.desc())
    )
    if featured_only:
        stmt = stmt.where(Project.featured.is_(True))
    result = await db.execute(stmt)
    projects = result.scalars().all()
    return [ProjectListResponse.model_validate(p) for p in projects]


async def get_project_by_id(db: AsyncSession, project_id: str) -> Optional[ProjectResponse]:
    """Fetch a single project with its associated skills."""
    stmt = (
        select(Project)
        .options(selectinload(Project.project_skills).selectinload(ProjectSkill.skill))
        .where(Project.id == project_id)
    )
    result = await db.execute(stmt)
    project = result.scalar_one_or_none()
    if project is None:
        return None

    # Build response with nested skills
    skills = []
    for ps in project.project_skills:
        if ps.skill:
            skills.append(ProjectSkillOut.model_validate(ps.skill))

    response_data = {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "short_description": project.short_description,
        "tech_stack": project.tech_stack,
        "project_url": project.project_url,
        "github_url": project.github_url,
        "image_url": project.image_url,
        "featured": project.featured,
        "order_index": project.order_index,
        "start_date": project.start_date,
        "end_date": project.end_date,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
        "skills": skills,
    }
    return ProjectResponse(**response_data)
