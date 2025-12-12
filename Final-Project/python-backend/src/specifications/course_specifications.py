"""
Course-specific Specifications

Concrete specification implementations for Course entity filtering.
"""
from sqlalchemy import ColumnElement
from src.specifications.base import Specification
from src.models.course import Course


class CourseNameSpecification(Specification):
    """
    Specification for filtering courses by name.

    Supports both partial (LIKE) and exact match.
    """

    def __init__(self, name: str, partial: bool = True):
        """
        Initialize course name specification.

        Args:
            name: Course name to search for
            partial: If True, uses ILIKE (case-insensitive partial match).
                    If False, uses exact match.
        """
        self.name = name
        self.partial = partial

    def to_sql_filter(self) -> ColumnElement[bool]:
        """
        Convert to SQLAlchemy filter condition.

        Returns:
            SQLAlchemy filter condition for course name
        """
        if self.partial:
            return Course.name.ilike(f"%{self.name}%")
        return Course.name == self.name


class CourseCodeSpecification(Specification):
    """
    Specification for filtering courses by code.

    Supports both partial (LIKE) and exact match.
    """

    def __init__(self, code: str, partial: bool = True):
        """
        Initialize course code specification.

        Args:
            code: Course code to search for
            partial: If True, uses ILIKE (case-insensitive partial match).
                    If False, uses exact match.
        """
        self.code = code
        self.partial = partial

    def to_sql_filter(self) -> ColumnElement[bool]:
        """
        Convert to SQLAlchemy filter condition.

        Returns:
            SQLAlchemy filter condition for course code
        """
        if self.partial:
            return Course.code.ilike(f"%{self.code}%")
        return Course.code == self.code


