"""
Composite Specifications

Specifications that combine other specifications using logical operators.
"""
from sqlalchemy import ColumnElement, and_, or_, not_
from src.specifications.base import Specification


class AndSpecification(Specification):
    """
    Specification that combines two specifications with AND logic.

    Example:
        spec = AndSpecification(
            CourseNameSpecification("Math"),
            CourseCodeSpecification("CS")
        )
        # Or using the & operator:
        spec = CourseNameSpecification("Math") & CourseCodeSpecification("CS")
    """

    def __init__(self, left: Specification, right: Specification):
        """
        Initialize AND specification.

        Args:
            left: First specification
            right: Second specification
        """
        self.left = left
        self.right = right

    def to_sql_filter(self) -> ColumnElement[bool]:
        """
        Convert to SQLAlchemy AND filter condition.

        Returns:
            SQLAlchemy AND condition combining both specifications
        """
        return and_(self.left.to_sql_filter(), self.right.to_sql_filter())


class OrSpecification(Specification):
    """
    Specification that combines two specifications with OR logic.

    Example:
        spec = OrSpecification(
            CourseNameSpecification("Math"),
            CourseNameSpecification("Physics")
        )
        # Or using the | operator:
        spec = CourseNameSpecification("Math") | CourseNameSpecification("Physics")
    """

    def __init__(self, left: Specification, right: Specification):
        """
        Initialize OR specification.

        Args:
            left: First specification
            right: Second specification
        """
        self.left = left
        self.right = right

    def to_sql_filter(self) -> ColumnElement[bool]:
        """
        Convert to SQLAlchemy OR filter condition.

        Returns:
            SQLAlchemy OR condition combining both specifications
        """
        return or_(self.left.to_sql_filter(), self.right.to_sql_filter())


class NotSpecification(Specification):
    """
    Specification that negates another specification.

    Example:
        spec = NotSpecification(CourseNameSpecification("Math"))
        # Or using the ~ operator:
        spec = ~CourseNameSpecification("Math")
    """

    def __init__(self, specification: Specification):
        """
        Initialize NOT specification.

        Args:
            specification: Specification to negate
        """
        self.specification = specification

    def to_sql_filter(self) -> ColumnElement[bool]:
        """
        Convert to SQLAlchemy NOT filter condition.

        Returns:
            SQLAlchemy NOT condition negating the specification
        """
        return not_(self.specification.to_sql_filter())
