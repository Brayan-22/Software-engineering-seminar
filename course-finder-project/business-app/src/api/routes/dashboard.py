"""
Dashboard Controller - Dashboard endpoints
"""
from fastapi import APIRouter, Depends, Query, status
from src.services.dashboard_service import DashboardService, get_dashboard_service
from src.schemas.dashboard_schema import (
    DashboardOverviewResponse,
    RecentActivitiesResponse,
    DashboardTotals,
)

router = APIRouter()


@router.get(
    "",
    response_model=DashboardOverviewResponse,
    summary="Get dashboard overview",
)
async def get_overview(
    service: DashboardService = Depends(get_dashboard_service),
):
    """
    Get complete dashboard overview.

    Returns statistics and recent activities for the dashboard.

    Returns:
        Dashboard overview including:
        - Total counts of professors, courses, and assignments
        - List of recent activities (last 10)
    """
    overview = service.get_overview()

    return DashboardOverviewResponse(
        totals=DashboardTotals(**overview["totals"]),
        recent_activities=overview["recent_activities"]
    )


@router.get(
    "/activities",
    response_model=RecentActivitiesResponse,
    summary="Get recent activities",
)
async def get_recent_activities(
    limit: int = Query(10, ge=1, le=100, description="Maximum number of activities to return"),
    service: DashboardService = Depends(get_dashboard_service),
):
    """
    Get list of recent activities in the system.

    Args:
        limit: Maximum number of activities to return (1-100, default: 10)
    Returns:
        List of recent activity descriptions
    """
    activities = service.get_recent_created_activities(limit)

    return RecentActivitiesResponse(
        activities=activities,
        total=len(activities)
    )
