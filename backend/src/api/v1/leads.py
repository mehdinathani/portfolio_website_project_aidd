from fastapi import APIRouter, HTTPException
from src.schemas.lead import LeadCreate, LeadResponse
from src.services.lead_service import create_lead

router = APIRouter()


@router.post("/", response_model=LeadResponse)
async def create_lead_endpoint(data: LeadCreate):
    return create_lead(data)
