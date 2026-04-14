"""Testimonial service — fetch testimonials."""

from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.testimonial import Testimonial
from src.schemas.testimonial import TestimonialResponse


async def get_testimonials(db: AsyncSession) -> List[TestimonialResponse]:
    """Fetch all testimonials ordered by date descending."""
    stmt = select(Testimonial).order_by(Testimonial.date.desc(), Testimonial.order_index.asc())
    result = await db.execute(stmt)
    testimonials = result.scalars().all()
    return [TestimonialResponse.model_validate(t) for t in testimonials]
