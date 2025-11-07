"""
ProfessorCourse Pydantic Schemas
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.professor_schema import ProfessorResponse
from app.schemas.course_schema import CourseResponse


class ProfessorCourseBase(BaseModel):
    """
    Base schema with common ProfessorCourse attributes.
    """
    professor_id: int = Field(..., gt=0, description="ID of the professor")
    course_id: int = Field(..., gt=0, description="ID of the course")
    status: str = Field(
        default="active",
        pattern="^(active|inactive|pending)$",
        description="Assignment status: active, inactive, or pending"
    )


class ProfessorCourseCreate(BaseModel):
    """
    Schema for creating a new ProfessorCourse assignment.
    """
    professor_id: int = Field(..., gt=0, description="ID of the professor")
    course_id: int = Field(..., gt=0, description="ID of the course")
    status: str = Field(
        default="active",
        pattern="^(active|inactive|pending)$",
        description="Assignment status: active, inactive, or pending"
    )


class ProfessorCourseUpdate(BaseModel):
    """
    Schema for updating an existing ProfessorCourse assignment.
    Typically used to change status.
    """
    status: str = Field(
        ...,
        pattern="^(active|inactive|pending)$",
        description="Assignment status: active, inactive, or pending"
    )


class ProfessorCourseResponse(ProfessorCourseBase):
    """
    Schema for ProfessorCourse responses.
    Includes database-generated fields.
    """
    id: int = Field(..., description="Assignment's unique identifier")
    assigned_at: datetime = Field(..., description="Timestamp when the assignment was created")

    model_config = ConfigDict(from_attributes=True)


class ProfessorCourseDetailResponse(ProfessorCourseResponse):
    """
    Schema for detailed ProfessorCourse responses with related entities.
    Includes professor and course information.
    """
    professor: Optional[ProfessorResponse] = Field(None, description="Professor information")
    course: Optional[CourseResponse] = Field(None, description="Course information")

    model_config = ConfigDict(from_attributes=True)


class ProfessorWithCoursesDetail(BaseModel):
    """
    Schema for Professor with detailed course assignments.
    """
    id: int = Field(..., description="Professor's unique identifier")
    name: str = Field(..., description="Professor's full name")
    email: str = Field(..., description="Professor's email address")
    specialty: Optional[str] = Field(None, description="Professor's area of specialty")
    courses: List[CourseResponse] = Field(default_factory=list, description="List of assigned courses")

    model_config = ConfigDict(from_attributes=True)


class CourseWithProfessorsDetail(BaseModel):
    """
    Schema for Course with detailed professor assignments.
    """
    id: int = Field(..., description="Course's unique identifier")
    name: str = Field(..., description="Course name")
    code: str = Field(..., description="Unique course code")
    category: Optional[str] = Field(None, description="Course category")
    professors: List[ProfessorResponse] = Field(default_factory=list, description="List of assigned professors")

    model_config = ConfigDict(from_attributes=True)


class ProfessorCourseListResponse(BaseModel):
    """
    Schema for paginated list of professor-course assignments.
    """
    assignments: List[ProfessorCourseDetailResponse]
    total: int = Field(..., description="Total number of assignments")
    skip: int = Field(..., ge=0, description="Number of records skipped")
    limit: int = Field(..., ge=1, le=100, description="Maximum number of records returned")

    model_config = ConfigDict(from_attributes=True)


class AssignmentStatusUpdate(BaseModel):
    """
    Schema for updating assignment status.
    """
    status: str = Field(
        ...,
        pattern="^(active|inactive|pending)$",
        description="New assignment status"
    )
