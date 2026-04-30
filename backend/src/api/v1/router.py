from fastapi import APIRouter
from src.api.v1 import profile, projects, skills, experience, certifications, testimonials, chat, leads, health

router = APIRouter(prefix="/api/v1")

router.include_router(profile.router, prefix="/profile", tags=["Profile"])
router.include_router(projects.router, prefix="/projects", tags=["Projects"])
router.include_router(skills.router, prefix="/skills", tags=["Skills"])
router.include_router(experience.router, prefix="/experience", tags=["Experience"])
router.include_router(certifications.router, prefix="/certifications", tags=["Certifications"])
router.include_router(testimonials.router, prefix="/testimonials", tags=["Testimonials"])
router.include_router(chat.router, prefix="/chat", tags=["Chat"])
router.include_router(leads.router, prefix="/leads", tags=["Leads"])
router.include_router(health.router, prefix="/health", tags=["Health"])
