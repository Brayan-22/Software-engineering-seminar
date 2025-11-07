"""
Course Pydantic Schemas
"""
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class CourseBase(BaseModel):
    """
    Base schema with common Course attributes.
    """
    name: str = Field(..., min_length=1, max_length=255, description="Course name")
    code: str = Field(..., min_length=1, max_length=50, description="Unique course code")
    category: Optional[str] = Field(None, max_length=100, description="Course category")


class CourseCreate(CourseBase):
    """
    Schema for creating a new Course.
    Inherits all fields from CourseBase.
    """
    pass


class CourseUpdate(BaseModel):
    """
    Schema for updating an existing Course.
    All fields are optional.
    """
    name: Optional[str] = Field(None, min_length=1, max_length=255, description="Course name")
    code: Optional[str] = Field(None, min_length=1, max_length=50, description="Unique course code")
    category: Optional[str] = Field(None, max_length=100, description="Course category")


class CourseResponse(CourseBase):
    """
    Schema for Course responses.
    Includes database-generated fields.
    """
    id: int = Field(..., description="Course's unique identifier")

    model_config = ConfigDict(from_attributes=True)


class CourseWithProfessorsResponse(CourseResponse):
    """
    Schema for Course with associated professors information.
    """
    professors_count: Optional[int] = Field(None, description="Number of professors assigned to course")

    model_config = ConfigDict(from_attributes=True)


class CourseListResponse(BaseModel):
    """
    Schema for paginated list of courses.
    """
    courses: List[CourseResponse]
    total: int = Field(..., description="Total number of courses")
    skip: int = Field(..., ge=0, description="Number of records skipped")
    limit: int = Field(..., ge=1, le=100, description="Maximum number of records returned")

    model_config = ConfigDict(from_attributes=True)


class CourseCategoryResponse(BaseModel):
    """
    Schema for course categories list.
    """
    categories: List[str] = Field(..., description="List of unique course categories")

    model_config = ConfigDict(from_attributes=True)
