"""
Search Schemas - Request and Response models for search operations
"""
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from src.schemas.professor_schema import ProfessorResponse
from src.schemas.course_schema import CourseResponse
from src.schemas.professor_course_schema import ProfessorCourseDetailResponse


class CourseListSearchResponse(BaseModel):
    """
    Response model for course search results
    """
    courses: List[CourseResponse]
    total: int = Field(..., description="Total number of courses found")
    model_config = ConfigDict(from_attributes=True)


class ProfessorListSearchResponse(BaseModel):
    """
    Response model for professor search results
    """
    professors: List[ProfessorResponse]
    total: int = Field(..., description="Total number of professors found")
    model_config = ConfigDict(from_attributes=True)


class AdvancedSearchRequest(BaseModel):
    """
    Request model for advanced search.

    Provide search terms for professors and/or courses.
    Searches are performed on:
    - professor: searches in professor name field
    - course: searches in course name and code fields
    """
    professor: Optional[str] = Field(
        None,
        min_length=1,
        description="Search term for professor name",
        example="John"
    )
    course: Optional[str] = Field(
        None,
        min_length=1,
        description="Search term for course name and code",
        example="Calculus"
    )


class AdvancedSearchResponse(BaseModel):
    """
    Response model for advanced search results.

    Returns assignments (professor-course relationships) matching the search criteria.
    """
    assignments: List[ProfessorCourseDetailResponse] = Field(
        ...,
        description="List of unique assignments matching the search criteria"
    )
    total: int = Field(..., description="Total number of unique assignments found")
    model_config = ConfigDict(from_attributes=True)
