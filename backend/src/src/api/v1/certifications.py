"""Certifications endpoint — GET /api/v1/certifications."""

from fastapi import APIRouter

from src.services.certification_service import get_certifications

router = APIRouter(prefix="/certifications", tags=["certifications"])


@router.get("")
async def read_certifications():
    """List all certifications in reverse chronological order."""
    return await get_certifications()
