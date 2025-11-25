"""
Specification Pattern Implementation

This module implements the Specification Pattern for building composable,
reusable query filters for database operations.
"""
from src.specifications.base import Specification
from src.specifications.course_specifications import (
    CourseNameSpecification,
    CourseCodeSpecification,
)
from src.specifications.professor_specifications import (
    ProfessorNameSpecification,
    ProfessorSpecialtySpecification,
)
from src.specifications.composite_specifications import (
    AndSpecification,
    OrSpecification,
    NotSpecification,
)

__all__ = [
    "Specification",
    "CourseNameSpecification",
    "CourseCodeSpecification",
    "ProfessorNameSpecification",
    "ProfessorSpecialtySpecification",
    "AndSpecification",
    "OrSpecification",
    "NotSpecification",
]
