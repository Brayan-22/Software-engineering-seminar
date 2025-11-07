"""
Pydantic Schemas (DTOs for request/response validation)
"""
# Professor schemas
from src.schemas.professor_schema import (
    ProfessorBase,
    ProfessorCreate,
    ProfessorUpdate,
    ProfessorResponse,
    ProfessorWithCoursesResponse,
    ProfessorListResponse,
)

# Course schemas
from src.schemas.course_schema import (
    CourseBase,
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseWithProfessorsResponse,
    CourseListResponse,
    CourseCategoryResponse,
)

# ProfessorCourse schemas
from src.schemas.professor_course_schema import (
    ProfessorCourseBase,
    ProfessorCourseCreate,
    ProfessorCourseUpdate,
    ProfessorCourseResponse,
    ProfessorCourseDetailResponse,
    ProfessorWithCoursesDetail,
    CourseWithProfessorsDetail,
    ProfessorCourseListResponse,
    AssignmentStatusUpdate,
)

__all__ = [
    # Professor
    "ProfessorBase",
    "ProfessorCreate",
    "ProfessorUpdate",
    "ProfessorResponse",
    "ProfessorWithCoursesResponse",
    "ProfessorListResponse",
    # Course
    "CourseBase",
    "CourseCreate",
    "CourseUpdate",
    "CourseResponse",
    "CourseWithProfessorsResponse",
    "CourseListResponse",
    "CourseCategoryResponse",
    # ProfessorCourse
    "ProfessorCourseBase",
    "ProfessorCourseCreate",
    "ProfessorCourseUpdate",
    "ProfessorCourseResponse",
    "ProfessorCourseDetailResponse",
    "ProfessorWithCoursesDetail",
    "CourseWithProfessorsDetail",
    "ProfessorCourseListResponse",
    "AssignmentStatusUpdate",
]
