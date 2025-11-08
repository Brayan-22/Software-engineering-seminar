"""
ProfessorCourse Repository - Basic CRUD Operations
"""
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import Depends
from src.models.professor_course import ProfessorCourse
from src.repositories.base import BaseRepository
from src.core.database import get_db


class ProfessorCourseRepository(BaseRepository[ProfessorCourse]):
    """
    Repository for ProfessorCourse association model with basic CRUD operations.
    """

    def __init__(self, db: Session = Depends(get_db)):
        """
        Initialize ProfessorCourse repository with database session.

        Args:
            db: Database session injected by FastAPI Depends
        """
        super().__init__(ProfessorCourse, db)

    def get_by_professor_and_course(
        self, professor_id: int, course_id: int
    ) -> Optional[ProfessorCourse]:
        """
        Get assignment by professor and course IDs.

        Args:
            professor_id: Professor ID
            course_id: Course ID

        Returns:
            ProfessorCourse instance or None if not found
        """
        return (
            self.db.query(ProfessorCourse)
            .filter(
                ProfessorCourse.professor_id == professor_id,
                ProfessorCourse.course_id == course_id,
            )
            .first()
        )

    def assignment_exists(
        self, professor_id: int, course_id: int, exclude_id: Optional[int] = None
    ) -> bool:
        """
        Check if assignment already exists.

        Args:
            professor_id: Professor ID
            course_id: Course ID
            exclude_id: Optional assignment ID to exclude from check (for updates)

        Returns:
            True if assignment exists, False otherwise
        """
        query = self.db.query(ProfessorCourse).filter(
            ProfessorCourse.professor_id == professor_id,
            ProfessorCourse.course_id == course_id,
        )
        if exclude_id:
            query = query.filter(ProfessorCourse.id != exclude_id)
        return query.first() is not None

def get_professor_course_repository(
    db: Session = Depends(get_db),
) -> ProfessorCourseRepository:
    """
    Dependency function to get ProfessorCourse repository instance.

    Args:
        db: Database session injected by FastAPI Depends

    Returns:
        ProfessorCourseRepository instance
    """
    return ProfessorCourseRepository(db)
