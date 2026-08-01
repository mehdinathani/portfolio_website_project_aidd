from fastapi import APIRouter, HTTPException, status
from src.schemas.certification import CertificationCreate, CertificationUpdate, CertificationResponse
from src.db.session import get_supabase

router = APIRouter(prefix="/certifications", tags=["Admin Certifications"])


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
