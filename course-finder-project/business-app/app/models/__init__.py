"""
Database Models (SQLAlchemy ORM)
"""
from app.models.professor import Professor
from app.models.course import Course
from app.models.professor_course import ProfessorCourse

__all__ = [
    "Professor",
    "Course",
    "ProfessorCourse",
]
