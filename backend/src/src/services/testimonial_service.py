"""Testimonial service — fetch testimonials using Supabase REST API."""

from typing import List
from src.db.session import supabase
from src.schemas.testimonial import TestimonialResponse


async def get_testimonials() -> List[TestimonialResponse]:
    """Fetch all testimonials ordered by date descending."""
    result = (
        supabase.table("testimonials")
        .select("*")
        .order("date", desc=True)
        .order("order_index", desc=False)
        .execute()
    )
    return [TestimonialResponse(**item) for item in result.data]
