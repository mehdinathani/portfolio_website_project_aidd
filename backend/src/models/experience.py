from sqlalchemy import Column, String, Date, Integer
from .base import BaseModel


class Experience(BaseModel):
    __tablename__ = "experience"

    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    start_date = Column(Date)
    end_date = Column(Date)
    responsibilities = Column(String)
    order_index = Column(Integer, default=0)
