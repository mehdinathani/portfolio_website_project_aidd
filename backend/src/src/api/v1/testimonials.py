"""Testimonials endpoint — GET /api/v1/testimonials."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import get_db
from src.services.testimonial_service import get_testimonials

router = APIRouter(prefix="/testimonials", tags=["testimonials"])


@router.get("")
async def read_testimonials(db: AsyncSession = Depends(get_db)):
    """List all testimonials in reverse chronological order."""
    return await get_testimonials(db)
