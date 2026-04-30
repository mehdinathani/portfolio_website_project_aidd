from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1.router import router as v1_router
from src.api.admin.router import router as admin_router
from src.middleware.logging import LoggingMiddleware
from src.middleware.rate_limiter import RateLimiterMiddleware
from src.middleware.auth import AuthMiddleware

app = FastAPI(title="Mehdi Portfolio API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
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
