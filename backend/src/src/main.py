import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import get_settings
from src.api.v1.router import router as v1_router
from src.middleware.logging import LoggingMiddleware

settings = get_settings()

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
)

app = FastAPI(
    title="Mehdi Portfolio API",
    description="AI-powered portfolio and lead generation platform backend",
    version="0.1.0",
)

# CORS middleware — allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware
app.add_middleware(LoggingMiddleware)

# Mount API v1 router
app.include_router(v1_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Mehdi Portfolio API", "version": "0.1.0"}
