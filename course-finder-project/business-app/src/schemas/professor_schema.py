"""
Professor Pydantic Schemas
"""
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict, Field


class ProfessorBase(BaseModel):
    """
    Base schema with common Professor attributes.
    """
    name: str = Field(..., min_length=1, max_length=255, description="Professor's full name")
    email: EmailStr = Field(..., description="Professor's email address")
    specialty: Optional[str] = Field(None, max_length=255, description="Professor's area of specialty")


class ProfessorCreate(ProfessorBase):
    """
    Schema for creating a new Professor.
    Inherits all fields from ProfessorBase.
    """
    pass


class ProfessorUpdate(BaseModel):
    """
    Schema for updating an existing Professor.
    All fields are optional.
    """
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Professor's full name")
    email: Optional[EmailStr] = Field(None, description="Professor's email address")
    specialty: Optional[str] = Field(None, max_length=255, description="Professor's area of specialty")


class ProfessorResponse(ProfessorBase):
    """
    Schema for Professor responses.
    Includes database-generated fields.
    """
    id: int = Field(..., description="Professor's unique identifier")

    model_config = ConfigDict(from_attributes=True)


class ProfessorWithCoursesResponse(ProfessorResponse):
    """
    Schema for Professor with associated courses information.
    """
    courses_count: Optional[int] = Field(None, description="Number of courses assigned to professor")

    model_config = ConfigDict(from_attributes=True)


class ProfessorListResponse(BaseModel):
    """
    Schema for paginated list of professors.
    """
    professors: List[ProfessorResponse]
    total: int = Field(..., description="Total number of professors")
    skip: int = Field(..., ge=0, description="Number of records skipped")
    limit: int = Field(..., ge=1, le=100, description="Maximum number of records returned")

    model_config = ConfigDict(from_attributes=True)
