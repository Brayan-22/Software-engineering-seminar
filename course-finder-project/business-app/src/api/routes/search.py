"""
Search Controller - Search endpoints
"""
from fastapi import APIRouter, Depends, Query, status
from src.services.search_service import SearchService, get_search_service
from src.schemas.search_schema import (
    CourseListSearchResponse,
    ProfessorListSearchResponse,
    AdvancedSearchRequest,
    AdvancedSearchResponse,
)
from src.schemas.course_schema import CourseResponse
from src.schemas.professor_schema import ProfessorResponse
from src.schemas.professor_course_schema import ProfessorCourseDetailResponse

router = APIRouter()


@router.get(
    "/professors",
    response_model=CourseListSearchResponse,
    summary="Search courses by professor name",
)
async def search_by_professors(
    query: str = Query(..., min_length=1, description="Professor name to search"),
    service: SearchService = Depends(get_search_service),
):
    """
    Search courses assigned to professors by professor name

    Args:
        search_term: Professor name to search
        service: SearchService dependency

    Returns:
        List of courses assigned to professors matching the search criteria
    """
    courses = service.search_by_professors_and_names(query, partial=True)
    return CourseListSearchResponse(
        courses=[CourseResponse.model_validate(c) for c in courses],
        total=len(courses)
    )


@router.get(
    "/course-names",
    response_model=ProfessorListSearchResponse,
    summary="Search professors by course names",
)
async def search_by_course_names(
    query: str = Query(..., min_length=1, description="Search term for course names"),
    service: SearchService = Depends(get_search_service),
):
    """
    Search professors by course name.
    Args:
        search_term: Term to search in course names

    Returns:
        List of professors assigned to matching courses
    """
    professors = service.search_by_course_names(query, partial=True)
    return ProfessorListSearchResponse(
        professors=[ProfessorResponse.model_validate(p) for p in professors],
        total=len(professors)
    )


@router.post(
    "/advanced",
    response_model=AdvancedSearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Advanced search returning assignments",
)
async def advanced_search(
    request: AdvancedSearchRequest,
    service: SearchService = Depends(get_search_service),
):
    """
    Advanced LIKE search that returns unique assignments (professor-course relationships).

    Performs flexible searches using partial matching (LIKE).
    Provide one or both search terms to find matching assignments without duplicates.

    Args:
        request: AdvancedSearchRequest with optional professor and course search terms
        service: SearchService dependency

    Returns:
        List of unique assignments (professor-course relationships) with full details
    """
    results = service.advanced_search(
        professor_term=request.professor,
        course_term=request.course
    )

    return AdvancedSearchResponse(
        assignments=[ProfessorCourseDetailResponse.model_validate(a) for a in results["assignments"]],
        total=results["total"]
    )
