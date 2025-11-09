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
    ProfessorSpecialtySpecification,
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
        Search courses by professor name or course name using Specification Pattern.

        This method searches for courses matching the search term in:
        - Course name
        - Course code
        - Professor names assigned to courses

        Args:
            search_term: Term to search
            partial: If True, uses LIKE search; if False, uses exact match

        Returns:
            List of courses matching the search criteria
        """
        # Build course specifications
        course_name_spec = CourseNameSpecification(search_term, partial)
        course_code_spec = CourseCodeSpecification(search_term, partial)
        course_spec = course_name_spec | course_code_spec

        # Search in courses directly using specifications
        courses_by_name = (
            self.db.query(Course)
            .filter(course_spec.to_sql_filter())
            .all()
        )

        # Build professor specifications
        professor_name_spec = ProfessorNameSpecification(search_term, partial)
        professor_specialty_spec = ProfessorSpecialtySpecification(search_term, partial)
        professor_spec = professor_name_spec | professor_specialty_spec

        # Search courses by professor using specifications
        courses_by_professor = (
            self.db.query(Course)
            .join(ProfessorCourse, Course.id == ProfessorCourse.course_id)
            .join(Professor, ProfessorCourse.professor_id == Professor.id)
            .filter(professor_spec.to_sql_filter())
            .all()
        )

        # Combine and deduplicate results
        course_dict = {course.id: course for course in courses_by_name}
        for course in courses_by_professor:
            course_dict[course.id] = course

        return list(course_dict.values())

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
    ) -> Dict[str, List]:
        """
        Advanced LIKE search across professors and courses using Specification Pattern.

        Performs flexible searches using partial matching (LIKE).
        - professor_term: searches in professor name field
        - course_term: searches in course name and code fields

        Args:
            professor_term: Optional search term for professor name
            course_term: Optional search term for course name and code

        Returns:
            Dictionary with search results
                Example: {
                    "professors": [<Professor>, ...],
                    "courses": [<Course>, ...],
                    "total_results": 15
                }
        """
        results = {
            "professors": [],
            "courses": [],
            "total_results": 0
        }

        # Search in professors if term provided
        if professor_term:
            # Create specification for professor name
            professor_spec = ProfessorNameSpecification(professor_term, partial=True)

            professors = (
                self.db.query(Professor)
                .filter(professor_spec.to_sql_filter())
                .distinct()
                .all()
            )
            results["professors"] = professors

        # Search in courses if term provided
        if course_term:
            # Create specifications for course name and code
            name_spec = CourseNameSpecification(course_term, partial=True)
            code_spec = CourseCodeSpecification(course_term, partial=True)

            # Combine with OR (name OR code)
            course_spec = name_spec | code_spec

            courses = (
                self.db.query(Course)
                .filter(course_spec.to_sql_filter())
                .distinct()
                .all()
            )
            results["courses"] = courses

        results["total_results"] = len(results["professors"]) + len(results["courses"])

        return results


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
