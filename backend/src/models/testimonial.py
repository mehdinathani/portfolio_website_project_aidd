from sqlalchemy import Column, String, Date, Integer
from .base import BaseModel


class Testimonial(BaseModel):
    __tablename__ = "testimonials"

    author_name = Column(String, nullable=False)
    author_role = Column(String)
    author_company = Column(String)
    quote = Column(String)
    linkedin_url = Column(String)
    date = Column(Date)
    order_index = Column(Integer, default=0)
