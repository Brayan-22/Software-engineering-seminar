"""
ProfessorCourse Service - Basic CRUD Business Logic
"""
from fastapi import Depends, HTTPException, status
from src.models.professor_course import ProfessorCourse
from src.repositories.professor_course_repository import (
    ProfessorCourseRepository,
    get_professor_course_repository,
)
from src.repositories.professor_repository import (
    ProfessorRepository,
    get_professor_repository,
)
from src.repositories.course_repository import (
    CourseRepository,
    get_course_repository,
)
from src.schemas.professor_course_schema import (
    ProfessorCourseCreate,
    ProfessorCourseUpdate,
    ProfessorCourseDetailResponse,
    ProfessorCourseListResponse,
)


class ProfessorCourseService:
    """
    Service class for ProfessorCourse basic CRUD business logic.
    """

    def __init__(
        self,
        repository: ProfessorCourseRepository = Depends(get_professor_course_repository),
        professor_repository: ProfessorRepository = Depends(get_professor_repository),
        course_repository: CourseRepository = Depends(get_course_repository),
    ):
        """
        Initialize ProfessorCourse service with repositories.

        Args:
            repository: ProfessorCourse repository
            professor_repository: Professor repository
            course_repository: Course repository
        """
        self.repository = repository
        self.professor_repository = professor_repository
        self.course_repository = course_repository

    def assign_course_to_professor(
        self, assignment_data: ProfessorCourseCreate
    ) -> ProfessorCourseDetailResponse:
        """
        Create a new professor-course assignment.

        Args:
            assignment_data: Assignment creation data

        Returns:
            Created assignment with details

        Raises:
            HTTPException: If professor or course not found, or assignment already exists
        """
        # Verify professor exists
        professor = self.professor_repository.get_by_id(assignment_data.professor_id)
        if not professor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Professor with id {assignment_data.professor_id} not found",
            )

        # Verify course exists
        course = self.course_repository.get_by_id(assignment_data.course_id)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with id {assignment_data.course_id} not found",
            )

        # Check if assignment already exists
        if self.repository.assignment_exists(
            assignment_data.professor_id, assignment_data.course_id
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Assignment already exists for professor {assignment_data.professor_id} and course {assignment_data.course_id}",
            )

        # Create assignment
        assignment = ProfessorCourse(**assignment_data.model_dump())
        created_assignment = self.repository.create(assignment)

        # Load relationships for response
        created_assignment.professor = professor
        created_assignment.course = course

        return ProfessorCourseDetailResponse.model_validate(created_assignment)

    def get_assignment_by_id(self, assignment_id: int) -> ProfessorCourseDetailResponse:
        """
        Get assignment by ID with details.

        Args:
            assignment_id: Assignment ID

        Returns:
            Assignment with professor and course details

        Raises:
            HTTPException: If assignment not found
        """
        assignment = self.repository.get_by_id(assignment_id)
        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Assignment with id {assignment_id} not found",
            )

        return ProfessorCourseDetailResponse.model_validate(assignment)

    def get_all_assignments(
        self, skip: int = 0, limit: int = 100
    ) -> ProfessorCourseListResponse:
        """
        Get all assignments with pagination.

        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            Paginated list of all assignments
        """
        assignments = self.repository.get_all(skip=skip, limit=limit)
        total = self.repository.count()

        return ProfessorCourseListResponse(
            assignments=[
                ProfessorCourseDetailResponse.model_validate(a) for a in assignments
            ],
            total=total,
            skip=skip,
            limit=limit,
        )

    def update_assignment_status(
        self, professor_id: int, course_id: int, status_data: ProfessorCourseUpdate
    ) -> ProfessorCourseDetailResponse:
        """
        Update the status of a professor-course assignment.

        Args:
            professor_id: Professor ID
            course_id: Course ID
            status_data: New status data

        Returns:
            Updated assignment with details

        Raises:
            HTTPException: If assignment not found
        """
        assignment = self.repository.get_by_professor_and_course(professor_id, course_id)

        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Assignment for professor {professor_id} and course {course_id} not found",
            )

        # Update assignment
        update_data = status_data.model_dump(exclude_unset=True)
        updated_assignment = self.repository.update(assignment, update_data)

        return ProfessorCourseDetailResponse.model_validate(updated_assignment)

    def unassign_course_from_professor(
        self, professor_id: int, course_id: int
    ) -> dict:
        """
        Remove course assignment from professor.

        Args:
            professor_id: Professor ID
            course_id: Course ID

        Returns:
            Success message

        Raises:
            HTTPException: If assignment not found
        """
        # Verify professor exists
        if not self.professor_repository.exists(professor_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Professor with id {professor_id} not found",
            )

        # Verify course exists
        if not self.course_repository.exists(course_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with id {course_id} not found",
            )

        # Get and delete assignment
        assignment = self.repository.get_by_professor_and_course(professor_id, course_id)
        if not assignment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Assignment for professor {professor_id} and course {course_id} not found",
            )

        self.repository.delete(assignment.id)

        return {
            "message": f"Assignment for professor {professor_id} and course {course_id} deleted successfully"
        }


def get_professor_course_service(
    repository: ProfessorCourseRepository = Depends(get_professor_course_repository),
    professor_repository: ProfessorRepository = Depends(get_professor_repository),
    course_repository: CourseRepository = Depends(get_course_repository),
) -> ProfessorCourseService:
    """
    Dependency function to get ProfessorCourse service instance.

    Args:
        repository: ProfessorCourse repository
        professor_repository: Professor repository
        course_repository: Course repository

    Returns:
        ProfessorCourseService instance
    """
    return ProfessorCourseService(repository, professor_repository, course_repository)
