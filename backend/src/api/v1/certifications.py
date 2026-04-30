from fastapi import APIRouter
from src.schemas.certification import CertificationResponse
from src.services.certification_service import get_certifications

router = APIRouter()


@router.get("/", response_model=list[CertificationResponse])
async def read_certifications():
    return get_certifications()
