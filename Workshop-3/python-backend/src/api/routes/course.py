from fastapi import APIRouter, Depends, Query, status
from src.services.course_service import CourseService, get_course_service
from src.api.dependencies import get_current_user
from src.schemas.course_schema import (
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseListResponse,
    CourseListPaginatedResponse,
)

router = APIRouter()


@router.post(
    "",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new course",
)
async def create_course(
    course_data: CourseCreate,
    current_user: dict = Depends(get_current_user),
    service: CourseService = Depends(get_course_service),
):
    return service.create_course(course_data)


@router.get(
    "",
    response_model=CourseListResponse,
    summary="Get all courses",
)
async def get_all_courses(
    service: CourseService = Depends(get_course_service),
):
    return service.get_all_courses()


@router.get(
    "/paginated",
    response_model=CourseListPaginatedResponse,
    summary="Get courses paginated",
)
async def get_courses_paginated(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    service: CourseService = Depends(get_course_service),
):
    return service.get_all_paginated(page=page, size=size)


@router.get(
    "/{course_id}",
    response_model=CourseResponse,
    summary="Get course by ID",
)
async def get_course_by_id(
    course_id: int,
    service: CourseService = Depends(get_course_service),
):
    return service.get_course_by_id(course_id)


@router.put(
    "/{course_id}",
    response_model=CourseResponse,
    summary="Update course",
)
async def update_course(
    course_id: int,
    course_data: CourseUpdate,
    current_user: dict = Depends(get_current_user),
    service: CourseService = Depends(get_course_service),
):
    return service.update_course(course_id, course_data)


@router.delete(
    "/{course_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete course",
)
async def delete_course(
    course_id: int,
    current_user: dict = Depends(get_current_user),
    service: CourseService = Depends(get_course_service),
):
    return service.delete_course(course_id)
