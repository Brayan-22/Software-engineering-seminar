"""
Course Repository - Basic CRUD Operations
"""
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models.course import Course
from app.repositories.base import BaseRepository
from app.core.database import get_db


class CourseRepository(BaseRepository[Course]):
    """
    Repository for Course model with basic CRUD operations.
    """

    def __init__(self, db: Session = Depends(get_db)):
        """
        Initialize Course repository with database session.

        Args:
            db: Database session injected by FastAPI Depends
        """
        super().__init__(Course, db)

    def code_exists(self, code: str, exclude_id: Optional[int] = None) -> bool:
        """
        Check if course code already exists in database.

        Args:
            code: Course code to check
            exclude_id: Optional course ID to exclude from check (for updates)

        Returns:
            True if code exists, False otherwise
        """
        query = self.db.query(Course).filter(Course.code == code)
        if exclude_id:
            query = query.filter(Course.id != exclude_id)
        return query.first() is not None


def get_course_repository(db: Session = Depends(get_db)) -> CourseRepository:
    """
    Dependency function to get Course repository instance.

    Args:
        db: Database session injected by FastAPI Depends

    Returns:
        CourseRepository instance
    """
    return CourseRepository(db)
