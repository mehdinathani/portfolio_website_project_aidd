from fastapi import APIRouter, HTTPException
from src.schemas.lead import LeadResponse, LeadFilter, LeadUpdate
from src.services.lead_service import get_leads, update_lead
from uuid import UUID

router = APIRouter(prefix="/leads", tags=["Admin Leads"])


@router.get("/", response_model=list[LeadResponse])
async def list_leads(category: str = None, status: str = None):
    filter_data = LeadFilter(category=category, status=status)
    return get_leads(filter_data)


@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: str):
    leads = get_leads()
    for lead in leads:
        if str(lead.id) == lead_id:
            return lead
    raise HTTPException(status_code=404, detail="Lead not found")


@router.patch("/{lead_id}", response_model=LeadResponse)
async def update_lead_status(lead_id: str, data: LeadUpdate):
    result = update_lead(lead_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Lead not found")
    return result
