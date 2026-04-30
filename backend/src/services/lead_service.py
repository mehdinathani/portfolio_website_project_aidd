from src.db.session import get_supabase
from src.schemas.lead import LeadCreate, LeadResponse, LeadFilter, LeadUpdate
from typing import List, Optional
from uuid import UUID


def create_lead(data: LeadCreate) -> LeadResponse:
    supabase = get_supabase()
    result = supabase.table("leads").insert(data.model_dump()).execute()
    return LeadResponse(**result.data[0])


def get_leads(filter: Optional[LeadFilter] = None) -> List[LeadResponse]:
    supabase = get_supabase()
    query = supabase.table("leads").select("*")
    if filter:
        if filter.category:
            query = query.eq("category", filter.category)
        if filter.status:
            query = query.eq("status", filter.status)
    result = query.order("created_at", desc=True).execute()
    return [LeadResponse(**l) for l in result.data]


def update_lead(lead_id: str, data: LeadUpdate) -> Optional[LeadResponse]:
    supabase = get_supabase()
    result = supabase.table("leads").update(data.model_dump(exclude_none=True)).eq("id", lead_id).execute()
    if not result.data:
        return None
    return LeadResponse(**result.data[0])
