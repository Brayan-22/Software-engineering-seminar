"""
Professor Service - Basic CRUD Business Logic
"""
from fastapi import Depends, HTTPException, status
from src.models.professor import Professor
from src.repositories.professor_repository import (
    ProfessorRepository,
    get_professor_repository,
)
from src.schemas.professor_schema import (
    ProfessorCreate,
    ProfessorUpdate,
    ProfessorResponse,
    ProfessorListResponse,
)


class ProfessorService:
    """
    Service class for Professor basic CRUD business logic.
    """

    def __init__(self, repository: ProfessorRepository = Depends(get_professor_repository)):
        """
        Initialize Professor service with repository.

        Args:
            repository: Professor repository injected by FastAPI Depends
        """
        self.repository = repository

    def create_professor(self, professor_data: ProfessorCreate) -> ProfessorResponse:
        """
        Create a new professor.

        Args:
            professor_data: Professor creation data

        Returns:
            Created professor response

        Raises:
            HTTPException: If email already exists
        """
        # Check if email already exists
        if self.repository.email_exists(professor_data.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Professor with email '{professor_data.email}' already exists",
            )

        # Create professor instance
        professor = Professor(**professor_data.model_dump())

        # Save to database
        created_professor = self.repository.create(professor)

        return ProfessorResponse.model_validate(created_professor)

    def get_professor_by_id(self, professor_id: int) -> ProfessorResponse:
        """
        Get professor by ID.

        Args:
            professor_id: Professor ID

        Returns:
            Professor response

        Raises:
            HTTPException: If professor not found
        """
        professor = self.repository.get_by_id(professor_id)
        if not professor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Professor with id {professor_id} not found",
            )

        return ProfessorResponse.model_validate(professor)

    def get_all_professors(
        self, skip: int = 0, limit: int = 100
    ) -> ProfessorListResponse:
        """
        Get all professors with pagination.

        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            Paginated list of professors
        """
        professors = self.repository.get_all(skip=skip, limit=limit)
        total = self.repository.count()

        return ProfessorListResponse(
            professors=[ProfessorResponse.model_validate(p) for p in professors],
            total=total,
            skip=skip,
            limit=limit,
        )

    def update_professor(
        self, professor_id: int, professor_data: ProfessorUpdate
    ) -> ProfessorResponse:
        """
        Update professor information.

        Args:
            professor_id: Professor ID
            professor_data: Professor update data

        Returns:
            Updated professor response

        Raises:
            HTTPException: If professor not found or email already exists
        """
        # Check if professor exists
        professor = self.repository.get_by_id(professor_id)
        if not professor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Professor with id {professor_id} not found",
            )

        # Get only fields that were provided (exclude None values)
        update_data = professor_data.model_dump(exclude_unset=True)

        # If email is being updated, check if it already exists
        if "email" in update_data:
            if self.repository.email_exists(update_data["email"], exclude_id=professor_id):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Professor with email '{update_data['email']}' already exists",
                )

        # Update professor
        updated_professor = self.repository.update(professor, update_data)

        return ProfessorResponse.model_validate(updated_professor)

    def delete_professor(self, professor_id: int) -> dict:
        """
        Delete professor by ID.

        Args:
            professor_id: Professor ID

        Returns:
            Success message

        Raises:
            HTTPException: If professor not found
        """
        # Check if professor exists
        if not self.repository.exists(professor_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Professor with id {professor_id} not found",
            )

        # Delete professor
        self.repository.delete(professor_id)

        return {"message": f"Professor with id {professor_id} deleted successfully"}


def get_professor_service(
    repository: ProfessorRepository = Depends(get_professor_repository),
) -> ProfessorService:
    """
    Dependency function to get Professor service instance.

    Args:
        repository: Professor repository injected by FastAPI Depends

    Returns:
        ProfessorService instance
    """
    return ProfessorService(repository)
