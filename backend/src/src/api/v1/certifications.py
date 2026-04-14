"""Certifications endpoint — GET /api/v1/certifications."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.services.certification_service import get_certifications

router = APIRouter(prefix="/certifications", tags=["certifications"])


@router.get("")
async def read_certifications(db: AsyncSession = Depends(get_db)):
    """List all certifications in reverse chronological order."""
    return await get_certifications(db)
