"""API v1 router — aggregates all public API sub-routers."""

from fastapi import APIRouter

from src.api.v1.profile import router as profile_router
from src.api.v1.projects import router as projects_router
from src.api.v1.skills import router as skills_router
from src.api.v1.experience import router as experience_router
from src.api.v1.certifications import router as certifications_router
from src.api.v1.testimonials import router as testimonials_router
from src.api.v1.chat import router as chat_router

router = APIRouter()

router.include_router(profile_router)
router.include_router(projects_router)
router.include_router(skills_router)
router.include_router(experience_router)
router.include_router(certifications_router)
router.include_router(testimonials_router)
router.include_router(chat_router)
