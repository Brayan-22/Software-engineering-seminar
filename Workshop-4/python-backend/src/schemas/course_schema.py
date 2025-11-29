from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class CourseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    code: str = Field(..., min_length=1, max_length=50)
    schedule: Optional[str] = Field(None, max_length=100)


class CourseCreate(CourseBase):
    pass


class CourseCreateMany(CourseBase):
    id: Optional[int] = Field(None, gt=0)

class CourseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    code: Optional[str] = Field(None, min_length=1, max_length=50)
    schedule: Optional[str] = Field(None, max_length=100)


class CourseResponse(CourseBase):
    id: int
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