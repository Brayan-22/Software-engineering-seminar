from fastapi import Depends, HTTPException, status
from src.models.course import Course
from src.repositories.course_repository import (
    CourseRepository,
    get_course_repository,
)
from src.schemas.course_schema import (
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    CourseListResponse,
    CourseListPaginatedResponse
)


class CourseService:
    def __init__(self, repository: CourseRepository = Depends(get_course_repository)):
        self.repository = repository

    def create_course(self, course_data: CourseCreate) -> CourseResponse:
        if self.repository.code_exists(course_data.code):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Course with code '{course_data.code}' already exists",
            )

        course = Course(**course_data.model_dump())
        created_course = self.repository.create(course)

        return CourseResponse.model_validate(created_course)

    def get_course_by_id(self, course_id: int) -> CourseResponse:
        course = self.repository.get_by_id(course_id)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with id {course_id} not found",
            )

        return CourseResponse.model_validate(course)

    def get_all_courses(self) -> CourseListResponse:
        courses = self.repository.get_all()
        total = self.repository.count()

        return CourseListResponse(
            courses=[CourseResponse.model_validate(c) for c in courses],
            total=total,
        )

    def update_course(self, course_id: int, course_data: CourseUpdate) -> CourseResponse:
        course = self.repository.get_by_id(course_id)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with id {course_id} not found",
            )

        update_data = course_data.model_dump(exclude_unset=True)

        if "code" in update_data:
            if self.repository.code_exists(update_data["code"], exclude_id=course_id):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Course with code '{update_data['code']}' already exists",
                )

        updated_course = self.repository.update(course, update_data)

        return CourseResponse.model_validate(updated_course)

    def delete_course(self, course_id: int) -> dict:
        if not self.repository.exists(course_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Course with id {course_id} not found",
            )

        self.repository.delete(course_id)

        return {"message": f"Course with id {course_id} deleted successfully"}

    def get_all_paginated(self, page: int = 1, size: int = 10) -> CourseListPaginatedResponse:
        skip = (page - 1) * size
        courses = self.repository.get_all_paginated(skip=skip, limit=size)
        total = self.repository.count()

        return CourseListPaginatedResponse(
            courses=[CourseResponse.model_validate(c) for c in courses],
            total=total,
            page=page,
            size=size,
        )

def get_course_service(
    repository: CourseRepository = Depends(get_course_repository),
) -> CourseService:
    return CourseService(repository)
