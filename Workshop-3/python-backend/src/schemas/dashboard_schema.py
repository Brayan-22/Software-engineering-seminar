"""
Dashboard Schemas - Request and Response models for dashboard operations
"""
from typing import List, Dict
from pydantic import BaseModel, ConfigDict, Field


class DashboardTotals(BaseModel):
    """
    Total counts for dashboard entities
    """
    professors: int = Field(..., ge=0, description="Total number of professors")
    courses: int = Field(..., ge=0, description="Total number of courses")
    assignments: int = Field(..., ge=0, description="Total number of assignments")


class DashboardOverviewResponse(BaseModel):
    """
    Complete dashboard overview response
    """
    totals: DashboardTotals
    recent_activities: List[str] = Field(
        ...,
        description="List of recent activities in the system"
    )
    model_config = ConfigDict(from_attributes=True)


class RecentActivitiesResponse(BaseModel):
    """
    Response model for recent activities
    """
    activities: List[str] = Field(
        ...,
        description="List of recent activity descriptions"
    )
    total: int = Field(..., ge=0, description="Number of activities returned")
    model_config = ConfigDict(from_attributes=True)
