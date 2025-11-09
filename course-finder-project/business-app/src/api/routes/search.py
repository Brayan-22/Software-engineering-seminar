"""
Search Controller - Search endpoints
"""
from fastapi import APIRouter, Depends, Query, status
from typing import List
from src.services.search_service import SearchService, get_search_service
from src.schemas.search_schema import (
    CourseListSearchResponse,
    ProfessorListSearchResponse,
    AdvancedSearchRequest,
    AdvancedSearchResponse,
)
from src.schemas.course_schema import CourseResponse
from src.schemas.professor_schema import ProfessorResponse

router = APIRouter()


@router.get(
    "",
    response_model=CourseListSearchResponse,
    summary="Search courses by query",
)
async def search(
    query: str = Query(..., min_length=1, description="Search query"),
    service: SearchService = Depends(get_search_service),
):
    """
    Search courses by professor names or course names.

    This endpoint performs a partial search (LIKE) on:
    - Course names
    - Course codes
    - Professor names assigned to courses
    - Professor specialties

    Args:
        query: Search term
        service: SearchService dependency

    Returns:
        List of courses matching the search criteria
    """
    courses = service.search_by_professors_and_names(query, partial=True)
    return CourseListSearchResponse(
        courses=[CourseResponse.model_validate(c) for c in courses],
        total=len(courses)
    )


@router.get(
    "/professors-and-names",
    response_model=CourseListSearchResponse,
    summary="Search courses by professors and names",
)
async def search_by_professors_and_names(
    search_term: str = Query(..., min_length=1, description="Search term"),
    service: SearchService = Depends(get_search_service),
):
    """
    Search courses by professor name or course name.

    Uses partial match (LIKE) for flexible searching.

    Args:
        search_term: Term to search
        service: SearchService dependency

    Returns:
        List of courses matching the search criteria
    """
    courses = service.search_by_professors_and_names(search_term, partial=True)
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
    search_term: str = Query(..., min_length=1, description="Search term for course names"),
    service: SearchService = Depends(get_search_service),
):
    """
    Search professors by course name.

    Finds all professors assigned to courses matching the search term.
    Uses partial match (LIKE) for flexible searching.

    Args:
        search_term: Term to search in course names
        service: SearchService dependency

    Returns:
        List of professors assigned to matching courses
    """
    professors = service.search_by_course_names(search_term, partial=True)
    return ProfessorListSearchResponse(
        professors=[ProfessorResponse.model_validate(p) for p in professors],
        total=len(professors)
    )


@router.post(
    "/advanced",
    response_model=AdvancedSearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Advanced search for professors and courses",
)
async def advanced_search(
    request: AdvancedSearchRequest,
    service: SearchService = Depends(get_search_service),
):
    """
    Advanced LIKE search across professors and courses.

    Performs flexible searches using partial matching (LIKE).
    Provide one or both search terms to find matching results.

    Request body example:
    ```json
    {
        "professor": "John",
        "course": "Calculus"
    }
    ```

    Search behavior:
    - **professor**: searches in professor name field
    - **course**: searches in course name AND code fields

    Args:
        request: AdvancedSearchRequest with optional professor and course search terms
        service: SearchService dependency

    Returns:
        Combined results of professors and courses matching the search criteria
    """
    results = service.advanced_search(
        professor_term=request.professor,
        course_term=request.course
    )

    return AdvancedSearchResponse(
        professors=[ProfessorResponse.model_validate(p) for p in results["professors"]],
        courses=[CourseResponse.model_validate(c) for c in results["courses"]],
        total_results=results["total_results"]
    )
