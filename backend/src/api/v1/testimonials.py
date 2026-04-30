from fastapi import APIRouter
from src.schemas.testimonial import TestimonialResponse
from src.services.testimonial_service import get_testimonials

router = APIRouter()


@router.get("/", response_model=list[TestimonialResponse])
async def read_testimonials():
    return get_testimonials()
