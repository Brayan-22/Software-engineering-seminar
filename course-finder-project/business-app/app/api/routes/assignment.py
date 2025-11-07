"""
Professor-Course Assignment API Routes - Basic CRUD Operations
"""
from fastapi import APIRouter, Depends, Query, status, Path
from app.services.professor_course_service import (
    ProfessorCourseService,
    get_professor_course_service,
)
from app.schemas.professor_course_schema import (
    ProfessorCourseCreate,
    ProfessorCourseUpdate,
    ProfessorCourseDetailResponse,
    ProfessorCourseListResponse,
)

router = APIRouter()


@router.post(
    "",
    response_model=ProfessorCourseDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create assignment",
    description="Create a new assignment between a professor and a course.",
)
async def create_assignment(
    assignment_data: ProfessorCourseCreate,
    service: ProfessorCourseService = Depends(get_professor_course_service),
):
    """
    Create a new professor-course assignment.

    - **professor_id**: ID of the professor (required)
    - **course_id**: ID of the course (required)
    - **status**: Assignment status - active, inactive, or pending (default: active)
    """
    return service.assign_course_to_professor(assignment_data)


@router.get(
    "",
    response_model=ProfessorCourseListResponse,
    summary="Get all assignments",
    description="Retrieve a paginated list of all professor-course assignments.",
)
async def get_all_assignments(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    service: ProfessorCourseService = Depends(get_professor_course_service),
):
    """
    Get all professor-course assignments with pagination.

    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records to return (default: 100, max: 100)
    """
    return service.get_all_assignments(skip=skip, limit=limit)


@router.get(
    "/{assignment_id}",
    response_model=ProfessorCourseDetailResponse,
    summary="Get assignment by ID",
    description="Retrieve a specific assignment by its ID.",
)
async def get_assignment_by_id(
    assignment_id: int = Path(..., gt=0, description="Assignment ID"),
    service: ProfessorCourseService = Depends(get_professor_course_service),
):
    """
    Get assignment by ID.

    - **assignment_id**: The ID of the assignment to retrieve (required)
    """
    return service.get_assignment_by_id(assignment_id)


@router.put(
    "/{assignment_id}",
    response_model=ProfessorCourseDetailResponse,
    summary="Update assignment",
    description="Update an existing assignment's status.",
)
async def update_assignment(
    assignment_data: ProfessorCourseUpdate,
    assignment_id: int = Path(..., gt=0, description="Assignment ID"),
    service: ProfessorCourseService = Depends(get_professor_course_service),
):
    """
    Update assignment information.

    - **assignment_id**: The ID of the assignment to update (required)
    - **status**: New status - active, inactive, or pending (required)
    """
    # Get the assignment first to extract professor_id and course_id
    assignment = service.get_assignment_by_id(assignment_id)
    return service.update_assignment_status(
        assignment.professor_id,
        assignment.course_id,
        assignment_data
    )


@router.delete(
    "/{assignment_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete assignment",
    description="Delete an assignment by its ID.",
)
async def delete_assignment(
    assignment_id: int = Path(..., gt=0, description="Assignment ID"),
    service: ProfessorCourseService = Depends(get_professor_course_service),
):
    """
    Delete assignment by ID.

    - **assignment_id**: The ID of the assignment to delete (required)
    """
    # Get the assignment first to extract professor_id and course_id
    assignment = service.get_assignment_by_id(assignment_id)
    return service.unassign_course_from_professor(
        assignment.professor_id,
        assignment.course_id
    )
