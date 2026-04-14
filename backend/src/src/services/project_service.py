"""Project service — fetch projects using Supabase REST API."""

from typing import List, Optional
from src.db.session import supabase
from src.schemas.project import ProjectListResponse, ProjectResponse, ProjectSkillOut


async def get_projects(featured_only: bool = False) -> List[ProjectListResponse]:
    """Fetch all projects (optionally featured only), ordered by order_index."""
    query = supabase.table("projects").select(
        "id, title, short_description, tech_stack, project_url, github_url, image_url, featured, order_index, created_at"
    ).order("order_index", desc=False).order("created_at", desc=True)
    
    if featured_only:
        query = query.eq("featured", True)
    
    result = query.execute()
    return [ProjectListResponse(**item) for item in result.data]


async def get_project_by_id(project_id: str) -> Optional[ProjectResponse]:
    """Fetch a single project with its associated skills."""
    # Fetch project data
    project_result = supabase.table("projects").select("*").eq("id", project_id).execute()
    
    if not project_result.data:
        return None
    
    project = project_result.data[0]
    
    # Fetch skills for this project via project_skills junction table
    skills_result = (
        supabase.table("project_skills")
        .select("skill:skills(id, name, category, proficiency)")
        .eq("project_id", project_id)
        .execute()
    )
    
    # Build response with nested skills
    skills = []
    for ps in skills_result.data:
        if ps.get("skill"):
            skills.append(ProjectSkillOut(**ps["skill"]))
    
    return ProjectResponse(
        id=project["id"],
        title=project["title"],
        description=project["description"],
        short_description=project["short_description"],
        tech_stack=project["tech_stack"],
        project_url=project.get("project_url"),
        github_url=project.get("github_url"),
        image_url=project.get("image_url"),
        featured=project["featured"],
        order_index=project["order_index"],
        start_date=project.get("start_date"),
        end_date=project.get("end_date"),
        created_at=project["created_at"],
        updated_at=project["updated_at"],
        skills=skills,
    )
