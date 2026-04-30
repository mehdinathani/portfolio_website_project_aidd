from pydantic import BaseModel
from typing import Generic, TypeVar, List, Optional
from datetime import datetime

T = TypeVar("T")


class PaginatedResponse(BaseModel):
    items: List[T]
    total: int
    page: int
    size: int


class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None
