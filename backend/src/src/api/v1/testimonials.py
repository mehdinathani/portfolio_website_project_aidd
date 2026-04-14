"""Testimonials endpoint — GET /api/v1/testimonials."""

from fastapi import APIRouter

from src.services.testimonial_service import get_testimonials

router = APIRouter(prefix="/testimonials", tags=["testimonials"])


@router.get("")
async def read_testimonials():
    """List all testimonials in reverse chronological order."""
    return await get_testimonials()
