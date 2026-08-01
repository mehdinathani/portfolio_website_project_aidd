from fastapi import APIRouter, HTTPException, status
from src.schemas.lead import LeadCreate, LeadResponse
from src.services.lead_service import create_lead

router = APIRouter()


@router.post("/", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead_endpoint(data: LeadCreate):
    return create_lead(data)
