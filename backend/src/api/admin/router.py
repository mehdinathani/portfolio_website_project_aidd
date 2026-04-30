from fastapi import APIRouter
from src.api.admin import projects, skills, experience, certifications, testimonials, knowledge_base, leads

router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])

router.include_router(projects.router)
router.include_router(skills.router)
router.include_router(experience.router)
router.include_router(certifications.router)
router.include_router(testimonials.router)
router.include_router(knowledge_base.router)
router.include_router(leads.router)
