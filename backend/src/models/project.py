from sqlalchemy import Column, String, Date, Integer, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from .base import BaseModel


class Project(BaseModel):
    __tablename__ = "projects"

    title = Column(String, nullable=False)
    description = Column(String)
    short_description = Column(String)
    tech_stack = Column(ARRAY(String))
    project_url = Column(String)
    github_url = Column(String)
    image_url = Column(String)
    featured = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    start_date = Column(Date)
    end_date = Column(Date)
