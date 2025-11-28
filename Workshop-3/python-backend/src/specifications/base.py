"""
Base Specification Class

Abstract base class for implementing the Specification Pattern.
Specifications encapsulate query logic that can be combined and reused.
"""
from abc import ABC, abstractmethod
from typing import Any
from sqlalchemy import ColumnElement


class Specification(ABC):
    """
    Abstract base class for Specifications.

    A Specification represents a business rule that can be checked against
    an object or used to filter database queries. This implementation is
    optimized for SQLAlchemy queries.
    """

    @abstractmethod
    def to_sql_filter(self) -> ColumnElement[bool]:
        """
        Convert the specification to a SQLAlchemy filter condition.

        Returns:
            SQLAlchemy ColumnElement that can be used in .filter() or .where()
        """
        pass

    def __and__(self, other: "Specification") -> "Specification":
        """
        Combine two specifications with AND logic using the & operator.

        Example:
            spec = CourseNameSpec("Math") & ProfessorNameSpec("Smith")

        Args:
            other: Another specification to combine

        Returns:
            AndSpecification combining both specifications
        """
        from src.specifications.composite_specifications import AndSpecification
        return AndSpecification(self, other)

    def __or__(self, other: "Specification") -> "Specification":
        """
        Combine two specifications with OR logic using the | operator.

        Example:
            spec = CourseNameSpec("Math") | CourseNameSpec("Physics")

        Args:
            other: Another specification to combine

        Returns:
            OrSpecification combining both specifications
        """
        from src.specifications.composite_specifications import OrSpecification
        return OrSpecification(self, other)

    def __invert__(self) -> "Specification":
        """
        Negate a specification using the ~ operator.

        Example:
            spec = ~CourseNameSpec("Math")  # NOT Math

        Returns:
            NotSpecification negating this specification
        """
        from src.specifications.composite_specifications import NotSpecification
        return NotSpecification(self)
