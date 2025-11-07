"""
Course Service - Basic CRUD Business Logic
"""
from fastapi import Depends, HTTPException, status
from src.models.course import Course
from src.repositories.course_repository import (
    CourseRepository,
    get_course_repository,
)
from src.schemas.course_schema import (
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseListResponse,
)


class CourseService:
    """
    Service class for Course basic CRUD business logic.
    """

    def __init__(self, repository: CourseRepository = Depends(get_course_repository)):
        """
        Initialize Course service with repository.

        Args:
            repository: Course repository injected by FastAPI Depends
        """
        self.repository = repository

    def create_course(self, course_data: CourseCreate) -> CourseResponse:
        """
        Create a new course.

        Args:
            course_data: Course creation data

        Returns:
            Created course response

        Raises:
            HTTPException: If course code already exists
        """
        # Check if course code already exists
        if self.repository.code_exists(course_data.code):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Course with code '{course_data.code}' already exists",
            )

        # Create course instance
        course = Course(**course_data.model_dump())

        # Save to database
        created_course = self.repository.create(course)

        return CourseResponse.model_validate(created_course)

    def get_course_by_id(self, course_id: int) -> CourseResponse:
        """
        Get course by ID.

        Args:
            course_id: Course ID

        Returns:
            Course response

        Raises:
            HTTPException: If course not found
        """
        course = self.repository.get_by_id(course_id)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with id {course_id} not found",
            )

        return CourseResponse.model_validate(course)

    def get_all_courses(self, skip: int = 0, limit: int = 100) -> CourseListResponse:
        """
        Get all courses with pagination.

        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            Paginated list of courses
        """
        courses = self.repository.get_all(skip=skip, limit=limit)
        total = self.repository.count()

        return CourseListResponse(
            courses=[CourseResponse.model_validate(c) for c in courses],
            total=total,
            skip=skip,
            limit=limit,
        )

    def update_course(
        self, course_id: int, course_data: CourseUpdate
    ) -> CourseResponse:
        """
        Update course information.

        Args:
            course_id: Course ID
            course_data: Course update data

        Returns:
            Updated course response

        Raises:
            HTTPException: If course not found or code already exists
        """
        # Check if course exists
        course = self.repository.get_by_id(course_id)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with id {course_id} not found",
            )

        # Get only fields that were provided (exclude None values)
        update_data = course_data.model_dump(exclude_unset=True)

        # If code is being updated, check if it already exists
        if "code" in update_data:
            if self.repository.code_exists(update_data["code"], exclude_id=course_id):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Course with code '{update_data['code']}' already exists",
                )

        # Update course
        updated_course = self.repository.update(course, update_data)

        return CourseResponse.model_validate(updated_course)

    def delete_course(self, course_id: int) -> dict:
        """
        Delete course by ID.

        Args:
            course_id: Course ID

        Returns:
            Success message

        Raises:
            HTTPException: If course not found
        """
        # Check if course exists
        if not self.repository.exists(course_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with id {course_id} not found",
            )

        # Delete course
        self.repository.delete(course_id)

        return {"message": f"Course with id {course_id} deleted successfully"}


def get_course_service(
    repository: CourseRepository = Depends(get_course_repository),
) -> CourseService:
    """
    Dependency function to get Course service instance.

    Args:
        repository: Course repository injected by FastAPI Depends

    Returns:
        CourseService instance
    """
    return CourseService(repository)
