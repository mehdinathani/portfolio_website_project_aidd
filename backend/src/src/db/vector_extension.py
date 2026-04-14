"""pgvector column type registration for SQLAlchemy.

This module ensures the pgvector extension is properly registered
so SQLAlchemy can use the vector(768) column type.
"""

from pgvector.sqlalchemy import Vector


def register_vector_types():
    """Register pgvector types with SQLAlchemy.

    Call this once during application startup before any models are loaded.
    """
    # Vector type is already registered via import above.
    # This function exists as a clear initialization point
    # and can be extended if custom vector dimensions are needed.
    pass
