"""
Professor API Routes - Basic CRUD Operations
"""
from fastapi import APIRouter, Depends, Query, status
from src.services.professor_service import ProfessorService, get_professor_service
from src.schemas.professor_schema import (
    ProfessorCreate,
    ProfessorUpdate,
    ProfessorResponse,
    ProfessorListResponse,
)

router = APIRouter()


@router.post(
    "",
    response_model=ProfessorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new professor",
    description="Create a new professor with the provided information.",
)
async def create_professor(
    professor_data: ProfessorCreate,
    service: ProfessorService = Depends(get_professor_service),
):
    """
    Create a new professor.

    - **name**: Professor's full name (required)
    - **email**: Professor's email address (required, must be unique)
    - **specialty**: Professor's area of specialty (optional)
    """
    return service.create_professor(professor_data)


@router.get(
    "",
    response_model=ProfessorListResponse,
    summary="Get all professors",
    description="Retrieve a paginated list of all professors.",
)
async def get_all_professors(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    service: ProfessorService = Depends(get_professor_service),
):
    """
    Get all professors with pagination.

    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records to return (default: 100, max: 100)
    """
    return service.get_all_professors(skip=skip, limit=limit)


@router.get(
    "/{professor_id}",
    response_model=ProfessorResponse,
    summary="Get professor by ID",
    description="Retrieve a specific professor by their ID.",
)
async def get_professor_by_id(
    professor_id: int,
    service: ProfessorService = Depends(get_professor_service),
):
    """
    Get professor by ID.

    - **professor_id**: The ID of the professor to retrieve (required)
    """
    return service.get_professor_by_id(professor_id)


@router.put(
    "/{professor_id}",
    response_model=ProfessorResponse,
    summary="Update professor",
    description="Update an existing professor's information.",
)
async def update_professor(
    professor_id: int,
    professor_data: ProfessorUpdate,
    service: ProfessorService = Depends(get_professor_service),
):
    """
    Update professor information.

    - **professor_id**: The ID of the professor to update (required)
    - **name**: New name (optional)
    - **email**: New email (optional, must be unique)
    - **specialty**: New specialty (optional)
    """
    return service.update_professor(professor_id, professor_data)


@router.delete(
    "/{professor_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete professor",
    description="Delete a professor by their ID.",
)
async def delete_professor(
    professor_id: int,
    service: ProfessorService = Depends(get_professor_service),
):
    """
    Delete professor by ID.

    - **professor_id**: The ID of the professor to delete (required)

    **Warning**: This will also delete all course assignments for this professor.
    """
    return service.delete_professor(professor_id)
