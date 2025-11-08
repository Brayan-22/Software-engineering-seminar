from fastapi import APIRouter, Depends, Query, status, Path
from src.services.professor_course_service import (
    ProfessorCourseService,
    get_professor_course_service,
)
from src.api.dependencies import get_current_user
from src.schemas.professor_course_schema import (
    AssignmentProfessorCourse,
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
)
async def create_assignment(
    assignment_data: AssignmentProfessorCourse,
    current_user: dict = Depends(get_current_user),
    service: ProfessorCourseService = Depends(get_professor_course_service),
):
    return service.create_assing(assignment_data)


@router.get(
    "",
    response_model=ProfessorCourseListResponse,
    summary="Get all assignments",
)
async def get_all_assignments(
    service: ProfessorCourseService = Depends(get_professor_course_service),
):
    return service.get_all_assignments()


@router.get(
    "/{assignment_id}",
    response_model=ProfessorCourseDetailResponse,
    summary="Get assignment by ID",
)
async def get_assignment_by_id(
    assignment_id: int = Path(..., gt=0),
    service: ProfessorCourseService = Depends(get_professor_course_service),
):
    return service.get_assignment_by_id(assignment_id)


@router.put(
    "/{assignment_id}",
    response_model=ProfessorCourseDetailResponse,
    summary="Update assignment",
)
async def update_assignment(
    assignment_data: ProfessorCourseUpdate,
    assignment_id: int = Path(..., gt=0),
    current_user: dict = Depends(get_current_user),
    service: ProfessorCourseService = Depends(get_professor_course_service),
):
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
)
async def delete_assignment(
    assignment_id: int = Path(..., gt=0),
    current_user: dict = Depends(get_current_user),
    service: ProfessorCourseService = Depends(get_professor_course_service),
):
    assignment = service.get_assignment_by_id(assignment_id)
    return service.unassign_course_from_professor(
        assignment.professor_id,
        assignment.course_id
    )
