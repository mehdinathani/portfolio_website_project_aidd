"""Certification service — fetch certifications."""

from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.certification import Certification
from src.schemas.certification import CertificationResponse


async def get_certifications(db: AsyncSession) -> List[CertificationResponse]:
    """Fetch all certifications ordered by date_earned descending."""
    stmt = select(Certification).order_by(Certification.date_earned.desc(), Certification.order_index.asc())
    result = await db.execute(stmt)
    certs = result.scalars().all()
    return [CertificationResponse.model_validate(c) for c in certs]
