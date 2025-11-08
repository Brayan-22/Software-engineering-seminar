from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class CourseBase(BaseModel):
    id: int = Field(None, gt=None)
    name: str = Field(..., min_length=1, max_length=255)
    code: str = Field(..., min_length=1, max_length=50)
    schedule: Optional[str] = Field(None, max_length=100)


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    code: Optional[str] = Field(None, min_length=1, max_length=50)
    schedule: Optional[str] = Field(None, max_length=100)


class CourseResponse(CourseBase):
    model_config = ConfigDict(from_attributes=True)


class CourseWithProfessorsResponse(CourseResponse):
    professors_count: Optional[int] = Field(None)
    model_config = ConfigDict(from_attributes=True)


class CourseListResponse(BaseModel):
    courses: List[CourseResponse]
    total: int
    model_config = ConfigDict(from_attributes=True)


class CourseListPaginatedResponse(BaseModel):
    courses: List[CourseResponse]
    total: int
    page: int
    size: int
    model_config = ConfigDict(from_attributes=True)