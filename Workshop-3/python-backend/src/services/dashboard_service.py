"""
Dashboard Service - Dashboard statistics and metrics
"""
from typing import Dict, List
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from src.models.professor import Professor
from src.models.course import Course
from src.models.professor_course import ProfessorCourse
from src.core.database import get_db


class DashboardService:
    """
    Service class for dashboard operations and statistics.
    """

    def __init__(self, db: Session = Depends(get_db)):
        """
        Initialize Dashboard service with database session.

        Args:
            db: Database session
        """
        self.db = db

    def get_totals(self) -> Dict[str, int]:
        """
        Get total counts of all entities.

        Returns:
            Dictionary with total counts for professors, courses, and assignments
            Example: {"professors": 10, "courses": 25, "assignments": 50}
        """
        professors_count = self.db.query(Professor).count()
        courses_count = self.db.query(Course).count()
        assignments_count = self.db.query(ProfessorCourse).count()

        return {
            "professors": professors_count,
            "courses": courses_count,
            "assignments": assignments_count,
        }

    def get_recent_created_activities(self, limit: int = 10) -> List[str]:
        """
        Get list of recent activities in the system.

        Returns formatted strings describing recent activities like:
        - "Professor Juan Perez created"
        - "Course Calculus I assigned to Professor Maria Garcia"

        Args:
            limit: Maximum number of activities to return (default: 10)

        Returns:
            List of activity description strings
        """
        activities = []

        # Get recent professor-course assignments
        recent_assignments = (
            self.db.query(ProfessorCourse)
            .order_by(desc(ProfessorCourse.assigned_at))
            .limit(limit)
            .all()
        )

        for assignment in recent_assignments:
            professor_name = assignment.professor.name if assignment.professor else "Unknown"
            course_name = assignment.course.name if assignment.course else "Unknown"
            status = assignment.status or "active"

            activities.append(
                f"Course '{course_name}' assigned to Professor {professor_name} ({status})"
            )

        return activities[:limit]

    def get_overview(self) -> Dict:
        """
        Get complete dashboard overview with totals and recent activities.

        Returns:
            Dictionary with totals and recent activities
        """
        totals = self.get_totals()
        recent_activities = self.get_recent_created_activities(limit=10)

        return {
            "totals": totals,
            "recent_activities": recent_activities,
        }


def get_dashboard_service(db: Session = Depends(get_db)) -> DashboardService:
    """
    Dependency function to get Dashboard service instance.

    Args:
        db: Database session

    Returns:
        DashboardService instance
    """
    return DashboardService(db)
