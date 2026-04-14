"""Certification service — fetch certifications using Supabase REST API."""

from typing import List
from src.db.session import supabase
from src.schemas.certification import CertificationResponse


async def get_certifications() -> List[CertificationResponse]:
    """Fetch all certifications ordered by date_earned descending."""
    result = (
        supabase.table("certifications")
        .select("*")
        .order("date_earned", desc=True)
        .order("order_index", desc=False)
        .execute()
    )
    return [CertificationResponse(**item) for item in result.data]
