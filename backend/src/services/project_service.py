from src.db.session import get_supabase
from src.schemas.project import ProjectResponse
from typing import List, Optional


def get_projects(featured_only: bool = False) -> List[ProjectResponse]:
    supabase = get_supabase()
    query = supabase.table("projects").select("*, project_skills(skills(*))").order("order_index")
    if featured_only:
        query = query.eq("featured", True)
    result = query.execute()
    return [ProjectResponse(**p) for p in result.data]


def get_project_by_id(project_id: str) -> Optional[ProjectResponse]:
    supabase = get_supabase()
    result = supabase.table("projects").select("*, project_skills(skills(*))").eq("id", project_id).limit(1).execute()
    if not result.data:
        return None
    return ProjectResponse(**result.data[0])
