from src.db.session import get_supabase
from src.schemas.certification import CertificationResponse
from typing import List


def get_certifications() -> List[CertificationResponse]:
    supabase = get_supabase()
    result = supabase.table("certifications").select("*").order("order_index").execute()
    return [CertificationResponse(**c) for c in result.data]
