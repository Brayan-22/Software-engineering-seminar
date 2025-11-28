"""
Database Models (SQLAlchemy ORM)
"""
from src.models.professor import Professor
from src.models.course import Course
from src.models.professor_course import ProfessorCourse

__all__ = [
    "Professor",
    "Course",
    "ProfessorCourse",
]
