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
    ProfessorListPaginatedResponse,
)


class ProfessorService:
    def __init__(self, repository: ProfessorRepository = Depends(get_professor_repository)):
        self.repository = repository

    def create_professor(self, professor_data: ProfessorCreate) -> ProfessorResponse:
        if self.repository.email_exists(professor_data.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Professor with email '{professor_data.email}' already exists",
            )

        professor = Professor(**professor_data.model_dump())
        created_professor = self.repository.create(professor)

        return ProfessorResponse.model_validate(created_professor)

    def get_professor_by_id(self, professor_id: int) -> ProfessorResponse:
        professor = self.repository.get_by_id(professor_id)
        if not professor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Professor with id {professor_id} not found",
            )

        return ProfessorResponse.model_validate(professor)

    def get_all_professors(self) -> ProfessorListResponse:
        professors = self.repository.get_all()
        total = self.repository.count()

        return ProfessorListResponse(
            professors=[ProfessorResponse.model_validate(p) for p in professors],
            total=total,
        )

    def update_professor(self, professor_id: int, professor_data: ProfessorUpdate) -> ProfessorResponse:
        professor = self.repository.get_by_id(professor_id)
        if not professor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Professor with id {professor_id} not found",
            )

        update_data = professor_data.model_dump(exclude_unset=True)

        if "email" in update_data:
            if self.repository.email_exists(update_data["email"], exclude_id=professor_id):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Professor with email '{update_data['email']}' already exists",
                )

        updated_professor = self.repository.update(professor, update_data)

        return ProfessorResponse.model_validate(updated_professor)

    def delete_professor(self, professor_id: int) -> dict:
        if not self.repository.exists(professor_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Professor with id {professor_id} not found",
            )

        self.repository.delete(professor_id)

        return {"message": f"Professor with id {professor_id} deleted successfully"}

    def get_all_paginated(self, page: int = 1, size: int = 10) -> ProfessorListPaginatedResponse:
        skip = (page - 1) * size
        professors = self.repository.get_all_paginated(skip=skip, limit=size)
        total = self.repository.count()

        return ProfessorListPaginatedResponse(
            professors=[ProfessorResponse.model_validate(p) for p in professors],
            total=total,
            page=page,
            size=size,
        )


def get_professor_service(
    repository: ProfessorRepository = Depends(get_professor_repository),
) -> ProfessorService:
    return ProfessorService(repository)
