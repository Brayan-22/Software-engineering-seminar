"""
ProfessorCourse Manager - Business Logic for Assignment Management
"""
from fastapi import Depends, HTTPException, status
from src.models.professor_course import ProfessorCourse
from src.models.course import Course
from src.models.professor import Professor
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
    AssignmentProfessorCourse,
    ProfessorCourseUpdate,
    ProfessorCourseDetailResponse,
    ProfessorCourseListResponse,
)

from src.schemas.professor_schema import ProfessorCreate
from src.schemas.course_schema import CourseCreate


class ProfessorCourseManager:
    """
    Manager class for ProfessorCourse assignment business logic.
    """

    def __init__(
        self,
        repository: ProfessorCourseRepository = Depends(get_professor_course_repository),
        professor_repository: ProfessorRepository = Depends(get_professor_repository),
        course_repository: CourseRepository = Depends(get_course_repository),
    ):
        """
        Initialize ProfessorCourse manager with repositories.

        Args:
            repository: ProfessorCourse repository
            professor_repository: Professor repository
            course_repository: Course repository
        """
        self.repository = repository
        self.professor_repository = professor_repository
        self.course_repository = course_repository

    def create_assing(self, assignment_data: AssignmentProfessorCourse):
        """
        Create a new professor-course assignment
        """
        # Search or craete professor
        if assignment_data.professor.id:
            professor = self.professor_repository.get_by_id(assignment_data.professor.id)
            if not professor:
                raise HTTPException(status_code=404, detail="Professor id not found")
        else:
            professor_to_create = Professor(**assignment_data.professor.model_dump(exclude={"id"}))
            professor = self.professor_repository.create(professor_to_create)

        # Search or create course
        if assignment_data.course.id:
            course = self.course_repository.get_by_id(assignment_data.course.id)
            if not course:
                raise HTTPException(status_code=404, detail="Course id not found")
        else:
            course_to_create = Course(**assignment_data.course.model_dump(exclude={"id"}))
            course = self.course_repository.create(course_to_create)
        # Check if assignment already exists
        if self.repository.assignment_exists(assignment_data.professor.id, assignment_data.course.id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Assignment for professor {professor.id} and course {course.id} already exists",
            )

        # Create assignment
        new_assignment = ProfessorCourse(
            professor_id=assignment_data.professor.id,
            course_id=assignment_data.course.id,
            status=assignment_data.status,
        )
        created_assignment = self.repository.create(new_assignment)

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

    def get_all_assignments(self) -> ProfessorCourseListResponse:
        """
        Get all assignments

        Returns:
            List of assignments with details and total count
        """
        assignments = self.repository.get_all()
        total = self.repository.count()

        return ProfessorCourseListResponse(
            assignments=[
                ProfessorCourseDetailResponse.model_validate(a) for a in assignments
            ],
            total=total,
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

def get_professor_course_manager(
    repository: ProfessorCourseRepository = Depends(get_professor_course_repository),
    professor_repository: ProfessorRepository = Depends(get_professor_repository),
    course_repository: CourseRepository = Depends(get_course_repository),
) -> ProfessorCourseManager:
    """
    Dependency function to get ProfessorCourse manager instance.

    Args:
        repository: ProfessorCourse repository
        professor_repository: Professor repository
        course_repository: Course repository

    Returns:
        ProfessorCourseManager instance
    """
    return ProfessorCourseManager(repository, professor_repository, course_repository)
