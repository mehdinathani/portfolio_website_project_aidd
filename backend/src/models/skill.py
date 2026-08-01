from sqlalchemy import Column, String, Integer
from .base import BaseModel


class Skill(BaseModel):
    __tablename__ = "skills"

    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    proficiency = Column(Integer)
    order_index = Column(Integer, default=0)


class ProjectSkill(BaseModel):
    __tablename__ = "project_skills"

    project_id = Column(Integer, ForeignKey("projects.id"), primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), primary_key=True)
