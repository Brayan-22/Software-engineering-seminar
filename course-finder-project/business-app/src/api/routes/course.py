"""
Course API Routes - Basic CRUD Operations
"""
from fastapi import APIRouter, Depends, Query, status
from src.services.course_service import CourseService, get_course_service
from src.schemas.course_schema import (
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseListResponse,
)

router = APIRouter()


@router.post(
    "",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new course",
    description="Create a new course with the provided information.",
)
async def create_course(
    course_data: CourseCreate,
    service: CourseService = Depends(get_course_service),
):
    """
    Create a new course.

    - **name**: Course name (required)
    - **code**: Unique course code (required, must be unique)
    - **category**: Course category (optional)
    """
    return service.create_course(course_data)


@router.get(
    "",
    response_model=CourseListResponse,
    summary="Get all courses",
    description="Retrieve a paginated list of all courses.",
)
async def get_all_courses(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    service: CourseService = Depends(get_course_service),
):
    """
    Get all courses with pagination.

    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records to return (default: 100, max: 100)
    """
    return service.get_all_courses(skip=skip, limit=limit)


@router.get(
    "/{course_id}",
    response_model=CourseResponse,
    summary="Get course by ID",
    description="Retrieve a specific course by its ID.",
)
async def get_course_by_id(
    course_id: int,
    service: CourseService = Depends(get_course_service),
):
    """
    Get course by ID.

    - **course_id**: The ID of the course to retrieve (required)
    """
    return service.get_course_by_id(course_id)


@router.put(
    "/{course_id}",
    response_model=CourseResponse,
    summary="Update course",
    description="Update an existing course's information.",
)
async def update_course(
    course_id: int,
    course_data: CourseUpdate,
    service: CourseService = Depends(get_course_service),
):
    """
    Update course information.

    - **course_id**: The ID of the course to update (required)
    - **name**: New name (optional)
    - **code**: New code (optional, must be unique)
    - **category**: New category (optional)
    """
    return service.update_course(course_id, course_data)


@router.delete(
    "/{course_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete course",
    description="Delete a course by its ID.",
)
async def delete_course(
    course_id: int,
    service: CourseService = Depends(get_course_service),
):
    """
    Delete course by ID.

    - **course_id**: The ID of the course to delete (required)

    **Warning**: This will also delete all professor assignments for this course.
    """
    return service.delete_course(course_id)
