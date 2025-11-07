"""
API Routes (Controllers/Endpoints)

This module serves as the central registry for all API routers.
Import this module to access all configured routers.
"""
from fastapi import APIRouter
from src.api.routes import professor, course, assignment

# Create main API router
api_router = APIRouter()

# Include all sub-routers with their prefixes and tags
api_router.include_router(
    professor.router,
    prefix="/professors",
    tags=["Professors"],
)

api_router.include_router(
    course.router,
    prefix="/courses",
    tags=["Courses"],
)

api_router.include_router(
    assignment.router,
    prefix="/assignments",
    tags=["Assignments"],
)

__all__ = ["api_router"]
