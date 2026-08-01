from sqlalchemy import Column, String, Date, Integer
from .base import BaseModel


class Certification(BaseModel):
    __tablename__ = "certifications"

    name = Column(String, nullable=False)
    issuer = Column(String)
    date_earned = Column(Date)
    credential_url = Column(String)
    order_index = Column(Integer, default=0)
