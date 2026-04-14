from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from src.config import get_settings

settings = get_settings()

# Supabase PostgreSQL connection URL (asyncpg driver)
DATABASE_URL = (
    f"postgresql+asyncpg://postgres.{settings.supabase_service_role_key}"
    f"@aws-0-{settings.supabase_url.split('//')[1].split('.')[0]}-pooler."
    f"supabase.com:6543/postgres"
)

# Fallback: direct connection string (override via env var if needed)
import os

DATABASE_URL = os.getenv("DATABASE_URL", DATABASE_URL)

engine = create_async_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=3600,
)

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    """Dependency that yields an async database session."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
