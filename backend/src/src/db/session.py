"""Supabase database client using supabase-py REST API."""

from supabase import create_client, Client
from src.config import get_settings

settings = get_settings()

# Initialize Supabase client using REST API (not direct PostgreSQL connection)
supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_role_key,
)


def get_supabase() -> Client:
    """Return the Supabase client instance for dependency injection."""
    return supabase
