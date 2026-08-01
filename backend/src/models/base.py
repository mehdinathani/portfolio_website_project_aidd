from sqlalchemy import Column, DateTime, func
from sqlalchemy.orm import declarative_base
import uuid

Base = declarative_base()


class BaseModel(Base):
    __abstract__ = True

    id = Column(uuid.UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
