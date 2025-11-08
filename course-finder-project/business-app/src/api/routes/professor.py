from fastapi import APIRouter, Depends, Query, status
from src.services.professor_service import ProfessorService, get_professor_service
from src.api.dependencies import get_current_user
from src.schemas.professor_schema import (
    ProfessorCreate,
    ProfessorUpdate,
    ProfessorResponse,
    ProfessorListResponse,
    ProfessorListPaginatedResponse,
)

router = APIRouter()


@router.post(
    "",
    response_model=ProfessorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new professor",
)
async def create_professor(
    professor_data: ProfessorCreate,
    current_user: dict = Depends(get_current_user),
    service: ProfessorService = Depends(get_professor_service),
):
    return service.create_professor(professor_data)


@router.get(
    "",
    response_model=ProfessorListResponse,
    summary="Get all professors",
)
async def get_all_professors(
    service: ProfessorService = Depends(get_professor_service),
):
    return service.get_all_professors()


@router.get(
    "/paginated",
    response_model=ProfessorListPaginatedResponse,
    summary="Get professors paginated",
)
async def get_professors_paginated(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    service: ProfessorService = Depends(get_professor_service),
):
    return service.get_all_paginated(page=page, size=size)


@router.get(
    "/{professor_id}",
    response_model=ProfessorResponse,
    summary="Get professor by ID",
)
async def get_professor_by_id(
    professor_id: int,
    service: ProfessorService = Depends(get_professor_service),
):
    return service.get_professor_by_id(professor_id)


@router.put(
    "/{professor_id}",
    response_model=ProfessorResponse,
    summary="Update professor",
)
async def update_professor(
    professor_id: int,
    professor_data: ProfessorUpdate,
    current_user: dict = Depends(get_current_user),
    service: ProfessorService = Depends(get_professor_service),
):
    return service.update_professor(professor_id, professor_data)


@router.delete(
    "/{professor_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete professor",
)
async def delete_professor(
    professor_id: int,
    current_user: dict = Depends(get_current_user),
    service: ProfessorService = Depends(get_professor_service),
):
    return service.delete_professor(professor_id)
