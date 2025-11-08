from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict, Field


class ProfessorBase(BaseModel):
    id: int = None
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr = Field(...)
    specialty: Optional[str] = Field(None, max_length=255)


class ProfessorCreate(ProfessorBase):
    pass


class ProfessorUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = Field(None)
    specialty: Optional[str] = Field(None, max_length=255)


class ProfessorResponse(ProfessorBase):
    model_config = ConfigDict(from_attributes=True)


class ProfessorWithCoursesResponse(ProfessorResponse):
    courses_count: Optional[int] = Field(None)
    model_config = ConfigDict(from_attributes=True)


class ProfessorListResponse(BaseModel):
    professors: List[ProfessorResponse]
    total: int
    model_config = ConfigDict(from_attributes=True)


class ProfessorListPaginatedResponse(BaseModel):
    professors: List[ProfessorResponse]
    total: int
    page: int
    size: int
    model_config = ConfigDict(from_attributes=True)
