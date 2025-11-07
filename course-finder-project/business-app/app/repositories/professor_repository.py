"""
Professor Repository - Basic CRUD Operations
"""
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import Depends
from app.models.professor import Professor
from app.repositories.base import BaseRepository
from app.core.database import get_db


class ProfessorRepository(BaseRepository[Professor]):
    """
    Repository for Professor model with basic CRUD operations.
    """

    def __init__(self, db: Session = Depends(get_db)):
        """
        Initialize Professor repository with database session.

        Args:
            db: Database session injected by FastAPI Depends
        """
        super().__init__(Professor, db)

    def email_exists(self, email: str, exclude_id: Optional[int] = None) -> bool:
        """
        Check if email already exists in database.

        Args:
            email: Email to check
            exclude_id: Optional professor ID to exclude from check (for updates)

        Returns:
            True if email exists, False otherwise
        """
        query = self.db.query(Professor).filter(Professor.email == email)
        if exclude_id:
            query = query.filter(Professor.id != exclude_id)
        return query.first() is not None


def get_professor_repository(db: Session = Depends(get_db)) -> ProfessorRepository:
    """
    Dependency function to get Professor repository instance.

    Args:
        db: Database session injected by FastAPI Depends

    Returns:
        ProfessorRepository instance
    """
    return ProfessorRepository(db)
