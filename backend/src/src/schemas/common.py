"""Common Pydantic schemas — pagination, error responses."""

from typing import Generic, TypeVar, List, Optional

from pydantic import BaseModel

T = TypeVar("T")


class ErrorResponse(BaseModel):
    """Standard error response format."""

    detail: str
    status_code: int


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper."""

    items: List[T]
    total: int
    page: int
    page_size: int
    has_next: bool
