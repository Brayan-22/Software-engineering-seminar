"""
Data Access Layer (Repositories)
"""
from src.repositories.base import BaseRepository
from src.repositories.professor_repository import (
    ProfessorRepository,
    get_professor_repository,
)
from src.repositories.course_repository import (
    CourseRepository,
    get_course_repository,
)
from src.repositories.professor_course_repository import (
    ProfessorCourseRepository,
    get_professor_course_repository,
)

__all__ = [
    "BaseRepository",
    "ProfessorRepository",
    "get_professor_repository",
    "CourseRepository",
    "get_course_repository",
    "ProfessorCourseRepository",
    "get_professor_course_repository",
]
