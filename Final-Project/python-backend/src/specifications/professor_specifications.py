"""
Professor-specific Specifications

Concrete specification implementations for Professor entity filtering.
"""
from sqlalchemy import ColumnElement
from src.specifications.base import Specification
from src.models.professor import Professor


class ProfessorNameSpecification(Specification):
    """
    Specification for filtering professors by name.

    Supports both partial (LIKE) and exact match.
    """

    def __init__(self, name: str, partial: bool = True):
        """
        Initialize professor name specification.

        Args:
            name: Professor name to search for
            partial: If True, uses ILIKE (case-insensitive partial match).
                    If False, uses exact match.
        """
        self.name = name
        self.partial = partial

    def to_sql_filter(self) -> ColumnElement[bool]:
        """
        Convert to SQLAlchemy filter condition.

        Returns:
            SQLAlchemy filter condition for professor name
        """
        if self.partial:
            return Professor.name.ilike(f"%{self.name}%")
        return Professor.name == self.name


class ProfessorSpecialtySpecification(Specification):
    """
    Specification for filtering professors by specialty.

    Supports both partial (LIKE) and exact match.
    """

    def __init__(self, specialty: str, partial: bool = True):
        """
        Initialize professor specialty specification.

        Args:
            specialty: Professor specialty to search for
            partial: If True, uses ILIKE (case-insensitive partial match).
                    If False, uses exact match.
        """
        self.specialty = specialty
        self.partial = partial

    def to_sql_filter(self) -> ColumnElement[bool]:
        """
        Convert to SQLAlchemy filter condition.

        Returns:
            SQLAlchemy filter condition for professor specialty
        """
        if self.partial:
            return Professor.specialty.ilike(f"%{self.specialty}%")
        return Professor.specialty == self.specialty
