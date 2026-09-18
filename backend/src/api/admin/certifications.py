from fastapi import APIRouter, HTTPException, status
from src.schemas.certification import CertificationCreate, CertificationUpdate, CertificationResponse
from src.db.session import get_supabase
from typing import List

router = APIRouter(prefix="/certifications", tags=["Admin Certifications"])


@router.get("/", response_model=list[CertificationResponse])
async def read_certifications():
    supabase = get_supabase()
    result = supabase.table("certifications").select("*").order("order_index").execute()
    return [CertificationResponse(**item) for item in result.data]


@router.post("/", response_model=CertificationResponse)
async def create_certification(data: CertificationCreate):
    supabase = get_supabase()
    result = supabase.table("certifications").insert(data.model_dump(exclude_none=True)).execute()
    return CertificationResponse(**result.data[0])


@router.put("/{cert_id}", response_model=CertificationResponse)
async def update_certification(cert_id: str, data: CertificationUpdate):
    supabase = get_supabase()
    result = supabase.table("certifications").update(data.model_dump(exclude_none=True)).eq("id", cert_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Certification not found")
    return CertificationResponse(**result.data[0])


@router.delete("/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_certification(cert_id: str):
    supabase = get_supabase()
    supabase.table("certifications").delete().eq("id", cert_id).execute()
