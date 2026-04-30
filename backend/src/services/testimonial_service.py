from src.db.session import get_supabase
from src.schemas.testimonial import TestimonialResponse
from typing import List


def get_testimonials() -> List[TestimonialResponse]:
    supabase = get_supabase()
    result = supabase.table("testimonials").select("*").order("order_index").execute()
    return [TestimonialResponse(**t) for t in result.data]
