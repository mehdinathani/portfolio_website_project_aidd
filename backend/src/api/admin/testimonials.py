from fastapi import APIRouter, HTTPException, status
from src.schemas.testimonial import TestimonialCreate, TestimonialUpdate, TestimonialResponse
from src.db.session import get_supabase

router = APIRouter(prefix="/testimonials", tags=["Admin Testimonials"])


@router.post("/", response_model=TestimonialResponse)
async def create_testimonial(data: TestimonialCreate):
    supabase = get_supabase()
    result = supabase.table("testimonials").insert(data.model_dump(exclude_none=True)).execute()
    return TestimonialResponse(**result.data[0])


@router.put("/{test_id}", response_model=TestimonialResponse)
async def update_testimonial(test_id: str, data: TestimonialUpdate):
    supabase = get_supabase()
    result = supabase.table("testimonials").update(data.model_dump(exclude_none=True)).eq("id", test_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return TestimonialResponse(**result.data[0])


@router.delete("/{test_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testimonial(test_id: str):
    supabase = get_supabase()
    supabase.table("testimonials").delete().eq("id", test_id).execute()
