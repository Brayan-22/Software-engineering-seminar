"""
Business Logic Layer (Services)
"""
from src.services.professor_service import (
    ProfessorService,
    get_professor_service,
)
from src.services.course_service import (
    CourseService,
    get_course_service,
)
from src.services.professor_course_manager import (
    ProfessorCourseManager,
    get_professor_course_manager,
)
from src.services.search_service import (
    SearchService,
    get_search_service,
)
from src.services.dashboard_service import (
    DashboardService,
    get_dashboard_service,
)

__all__ = [
    "ProfessorService",
    "get_professor_service",
    "CourseService",
    "get_course_service",
    "ProfessorCourseManager",
    "get_professor_course_manager",
    "SearchService",
    "get_search_service",
    "DashboardService",
    "get_dashboard_service",
]
