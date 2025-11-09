"""
Search Service - Complex search business logic using Specification Pattern
"""
from typing import List, Dict
from fastapi import Depends
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload
from src.models.course import Course
from src.models.professor import Professor
from src.models.professor_course import ProfessorCourse
from src.repositories.professor_repository import (
    ProfessorRepository,
    get_professor_repository,
)
from src.repositories.course_repository import (
    CourseRepository,
    get_course_repository,
)
from src.core.database import get_db
from src.specifications import (
    CourseNameSpecification,
    CourseCodeSpecification,
    ProfessorNameSpecification,
)


class SearchService:
    """
    Service class for complex search operations across courses and professors.
    """

    def __init__(
        self,
        db: Session = Depends(get_db),
        professor_repository: ProfessorRepository = Depends(get_professor_repository),
        course_repository: CourseRepository = Depends(get_course_repository),
    ):
        """
        Initialize Search service with database session and repositories.

        Args:
            db: Database session
            professor_repository: Professor repository
            course_repository: Course repository
        """
        self.db = db
        self.professor_repository = professor_repository
        self.course_repository = course_repository

    def search_by_professors_and_names(
        self, search_term: str, partial: bool = True
    ) -> List[Course]:
        """
        Search courses by professor name only using Specification Pattern.

        This method searches for courses assigned to professors whose name matches the search term.

        Args:
            search_term: Term to search in professor names
            partial: If True, uses LIKE search; if False, uses exact match

        Returns:
            List of courses assigned to matching professors
        """
        # Build professor name specification
        professor_name_spec = ProfessorNameSpecification(search_term, partial)

        # Search courses by professor name using specifications
        courses = (
            self.db.query(Course)
            .join(ProfessorCourse, Course.id == ProfessorCourse.course_id)
            .join(Professor, ProfessorCourse.professor_id == Professor.id)
            .filter(professor_name_spec.to_sql_filter())
            .distinct()
            .all()
        )

        return courses

    def search_by_course_names(
        self, search_term: str, partial: bool = True
    ) -> List[Professor]:
        """
        Search professors by course name using Specification Pattern.

        Finds all professors assigned to courses matching the search term.

        Args:
            search_term: Term to search in course names
            partial: If True, uses LIKE search; if False, uses exact match

        Returns:
            List of professors assigned to matching courses
        """
        # Build course specifications
        course_name_spec = CourseNameSpecification(search_term, partial)
        course_code_spec = CourseCodeSpecification(search_term, partial)
        course_spec = course_name_spec | course_code_spec

        # Search professors by course using specifications
        professors = (
            self.db.query(Professor)
            .join(ProfessorCourse, Professor.id == ProfessorCourse.professor_id)
            .join(Course, ProfessorCourse.course_id == Course.id)
            .filter(course_spec.to_sql_filter())
            .distinct()
            .all()
        )

        return professors

    def advanced_search(
        self,
        professor_term: str | None = None,
        course_term: str | None = None
    ) -> Dict[str, any]:
        """
        Advanced LIKE search that returns assignments (professor-course relationships).

        Args:
            professor_term: Optional search term for professor name
            course_term: Optional search term for course name and code

        Returns:
            Dictionary with assignments
                Example: {
                    "assignments": [<ProfessorCourse>, ...],
                    "total": 10
                }
        """
        # Start with base query for assignments with eager loading
        query = self.db.query(ProfessorCourse).options(
            joinedload(ProfessorCourse.professor),
            joinedload(ProfessorCourse.course)
        )

        # Always join the necessary tables for filtering
        query = query.join(Professor, ProfessorCourse.professor_id == Professor.id)

        # Join Course table (needed if course_term is provided)
        query = query.join(Course, ProfessorCourse.course_id == Course.id)

        # Build filters based on provided search terms
        filters = []

        # Add professor name filter if provided
        if professor_term:
            professor_spec = ProfessorNameSpecification(professor_term, partial=True)
            filters.append(professor_spec.to_sql_filter())

        # Add course name/code filter if provided
        if course_term:
            name_spec = CourseNameSpecification(course_term, partial=True)
            code_spec = CourseCodeSpecification(course_term, partial=True)
            course_spec = name_spec | code_spec
            filters.append(course_spec.to_sql_filter())

        # Apply all filters with AND logic
        if filters:
            from sqlalchemy import and_
            query = query.filter(and_(*filters))

        # Execute query and get assignments
        assignments = query.distinct().all()

        # Additional deduplication by assignment ID to ensure uniqueness
        seen_ids = set()
        unique_assignments = []
        for assignment in assignments:
            if assignment.id not in seen_ids:
                seen_ids.add(assignment.id)
                unique_assignments.append(assignment)

        return {
            "assignments": unique_assignments,
            "total": len(unique_assignments)
        }


def get_search_service(
    db: Session = Depends(get_db),
    professor_repository: ProfessorRepository = Depends(get_professor_repository),
    course_repository: CourseRepository = Depends(get_course_repository),
) -> SearchService:
    """
    Dependency function to get Search service instance.

    Args:
        db: Database session
        professor_repository: Professor repository
        course_repository: Course repository

    Returns:
        SearchService instance
    """
    return SearchService(db, professor_repository, course_repository)
