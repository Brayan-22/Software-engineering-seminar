from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from src.schemas.professor_schema import ProfessorResponse
from src.schemas.course_schema import CourseResponse
from src.schemas.professor_schema import ProfessorCreate
from src.schemas.course_schema import CourseCreate


class ProfessorCourseBase(BaseModel):
    professor_id: int = Field(..., gt=0)
    course_id: int = Field(..., gt=0)
    status: str = Field(default="active", pattern="^(active|inactive|pending)$")


class ProfessorCourseCreate(BaseModel):
    professor_id: int = Field(..., gt=0)
    course_id: int = Field(..., gt=0)
    status: str = Field(default="active", pattern="^(active|inactive|pending)$")


class ProfessorCourseUpdate(BaseModel):
    status: str = Field(..., pattern="^(active|inactive|pending)$")


class ProfessorCourseResponse(ProfessorCourseBase):
    id: int
    assigned_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ProfessorCourseDetailResponse(ProfessorCourseResponse):
    professor: Optional[ProfessorResponse] = Field(None)
    course: Optional[CourseResponse] = Field(None)
    model_config = ConfigDict(from_attributes=True)


class ProfessorWithCoursesDetail(BaseModel):
    id: int
    name: str
    email: str
    specialty: Optional[str] = Field(None)
    courses: List[CourseResponse] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)


class CourseWithProfessorsDetail(BaseModel):
    id: int
    name: str
    code: str
    schedule: Optional[str] = Field(None)
    professors: List[ProfessorResponse] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)


class ProfessorCourseListResponse(BaseModel):
    assignments: List[ProfessorCourseDetailResponse]
    total: int
    model_config = ConfigDict(from_attributes=True)


class AssignmentStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(active|inactive|pending)$")


class AssignmentProfessorCourse(BaseModel):
    professor: ProfessorCreate
    course: CourseCreate
    status: str = Field(default="active", pattern="^(active|inactive|pending)$")
    model_config = ConfigDict(from_attributes=True)