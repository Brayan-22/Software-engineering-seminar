"""
Pytest configuration and shared fixtures for tests
"""
import pytest
from unittest.mock import Mock, MagicMock
from datetime import datetime

from src.models.professor import Professor
from src.models.course import Course
from src.schemas.professor_schema import ProfessorCreate, ProfessorUpdate
from src.schemas.course_schema import CourseCreate, CourseUpdate


# ===================================================================
# Professor Fixtures
# ===================================================================

@pytest.fixture
def professor_data():
    """Sample professor data for creation"""
    return {
        "name": "Dr. John Smith",
        "email": "john.smith@university.edu",
        "specialty": "Computer Science"
    }


@pytest.fixture
def professor_create(professor_data):
    """ProfessorCreate schema instance"""
    return ProfessorCreate(**professor_data)


@pytest.fixture
def professor_update():
    """ProfessorUpdate schema instance"""
    return ProfessorUpdate(
        name="Dr. John Updated",
        specialty="Artificial Intelligence"
    )


@pytest.fixture
def professor_model(professor_data):
    """Professor model instance"""
    professor = Professor(**professor_data)
    professor.id = 1
    professor.created_at = datetime.now()
    professor.updated_at = datetime.now()
    return professor


@pytest.fixture
def professor_list():
    """List of professor model instances"""
    professors = []
    for i in range(1, 4):
        prof = Professor(
            name=f"Dr. Professor {i}",
            email=f"prof{i}@university.edu",
            specialty=f"Specialty {i}"
        )
        prof.id = i
        prof.created_at = datetime.now()
        prof.updated_at = datetime.now()
        professors.append(prof)
    return professors


# ===================================================================
# Course Fixtures
# ===================================================================

@pytest.fixture
def course_data():
    """Sample course data for creation"""
    return {
        "name": "Introduction to Programming",
        "code": "CS101",
        "schedule": "Mon/Wed/Fri 09:00-10:00"
    }


@pytest.fixture
def course_create(course_data):
    """CourseCreate schema instance"""
    return CourseCreate(**course_data)


@pytest.fixture
def course_update():
    """CourseUpdate schema instance"""
    return CourseUpdate(
        name="Advanced Programming",
        schedule="Tue/Thu 14:00-16:00"
    )


@pytest.fixture
def course_model(course_data):
    """Course model instance"""
    course = Course(**course_data)
    course.id = 1
    course.created_at = datetime.now()
    course.updated_at = datetime.now()
    return course


@pytest.fixture
def course_list():
    """List of course model instances"""
    courses = []
    for i in range(1, 4):
        course = Course(
            name=f"Course {i}",
            code=f"CS{100 + i}",
            schedule=f"Mon/Wed {i}:00-{i+1}:00"
        )
        course.id = i
        course.created_at = datetime.now()
        course.updated_at = datetime.now()
        courses.append(course)
    return courses


# ===================================================================
# Mock Repository Fixtures
# ===================================================================

@pytest.fixture
def mock_professor_repository():
    """Mock ProfessorRepository"""
    repository = Mock()
    repository.create = Mock()
    repository.get_by_id = Mock()
    repository.get_all = Mock()
    repository.update = Mock()
    repository.delete = Mock()
    repository.exists = Mock()
    repository.email_exists = Mock()
    repository.count = Mock()
    repository.get_all_paginated = Mock()
    return repository


@pytest.fixture
def mock_course_repository():
    """Mock CourseRepository"""
    repository = Mock()
    repository.create = Mock()
    repository.get_by_id = Mock()
    repository.get_all = Mock()
    repository.update = Mock()
    repository.delete = Mock()
    repository.exists = Mock()
    repository.code_exists = Mock()
    repository.count = Mock()
    repository.get_all_paginated = Mock()
    return repository
