import sys
from pathlib import Path

# Ensure the backend directory is in sys.path so 'src' imports work
_backend_root = Path(__file__).resolve().parent.parent
if str(_backend_root) not in sys.path:
    sys.path.insert(0, str(_backend_root))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1.router import router as v1_router
from src.api.admin.router import router as admin_router
from src.middleware.logging import LoggingMiddleware
from src.middleware.rate_limiter import RateLimiterMiddleware
from src.middleware.auth import AuthMiddleware
from src.config import settings

app = FastAPI(title="Mehdi Portfolio API", version="1.0.0")


@app.on_event("startup")
async def startup_validate_supabase():
    from src.db.session import get_supabase
    try:
        get_supabase()
        print("✓ Supabase client initialized successfully")
    except Exception as e:
        print(f"✗ WARNING: Could not initialize Supabase client: {e}")
        print("  API endpoints requiring Supabase will return errors.")
        print("  Check your SUPABASE_SERVICE_ROLE_KEY in backend/.env")

# CORS
if settings.cors_origins:
    origins = [o.strip() for o in settings.cors_origins.split(",")]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Custom middleware
app.add_middleware(LoggingMiddleware)
app.add_middleware(RateLimiterMiddleware, rpm=15)
app.add_middleware(AuthMiddleware)

# Routers
app.include_router(v1_router)
app.include_router(admin_router)


@app.get("/")
async def root():
    return {"message": "Mehdi Portfolio API is running"}
