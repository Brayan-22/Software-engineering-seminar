"""
Unit tests for CourseService

Tests the business logic layer for course operations.
"""
import pytest
from fastapi import HTTPException

from src.services.course_service import CourseService
from src.schemas.course_schema import CourseResponse, CourseListResponse


class TestCourseServiceCreate:
    """Tests for creating courses"""

    def test_create_course_success(
        self, mock_course_repository, course_create, course_model
    ):
        """Test successful course creation"""
        # Arrange
        mock_course_repository.code_exists.return_value = False
        mock_course_repository.create.return_value = course_model
        service = CourseService(mock_course_repository)

        # Act
        result = service.create_course(course_create)

        # Assert
        assert isinstance(result, CourseResponse)
        assert result.name == course_model.name
        assert result.code == course_model.code
        assert result.schedule == course_model.schedule
        mock_course_repository.code_exists.assert_called_once_with(course_create.code)
        mock_course_repository.create.assert_called_once()

    def test_create_course_duplicate_code(
        self, mock_course_repository, course_create
    ):
        """Test creating course with duplicate code raises HTTPException"""
        # Arrange
        mock_course_repository.code_exists.return_value = True
        service = CourseService(mock_course_repository)

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.create_course(course_create)

        assert exc_info.value.status_code == 409
        assert "already exists" in exc_info.value.detail
        mock_course_repository.create.assert_not_called()


class TestCourseServiceRead:
    """Tests for reading courses"""

    def test_get_course_by_id_success(
        self, mock_course_repository, course_model
    ):
        """Test successful retrieval of course by ID"""
        # Arrange
        mock_course_repository.get_by_id.return_value = course_model
        service = CourseService(mock_course_repository)

        # Act
        result = service.get_course_by_id(1)

        # Assert
        assert isinstance(result, CourseResponse)
        assert result.id == course_model.id
        assert result.name == course_model.name
        assert result.code == course_model.code
        mock_course_repository.get_by_id.assert_called_once_with(1)

    def test_get_course_by_id_not_found(self, mock_course_repository):
        """Test getting non-existent course raises HTTPException"""
        # Arrange
        mock_course_repository.get_by_id.return_value = None
        service = CourseService(mock_course_repository)

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.get_course_by_id(999)

        assert exc_info.value.status_code == 404
        assert "not found" in exc_info.value.detail

    def test_get_all_courses_success(
        self, mock_course_repository, course_list
    ):
        """Test successful retrieval of all courses"""
        # Arrange
        mock_course_repository.get_all.return_value = course_list
        mock_course_repository.count.return_value = len(course_list)
        service = CourseService(mock_course_repository)

        # Act
        result = service.get_all_courses()

        # Assert
        assert isinstance(result, CourseListResponse)
        assert len(result.courses) == 3
        assert result.total == 3
        mock_course_repository.get_all.assert_called_once()
        mock_course_repository.count.assert_called_once()

    def test_get_all_courses_empty(self, mock_course_repository):
        """Test getting all courses when none exist"""
        # Arrange
        mock_course_repository.get_all.return_value = []
        mock_course_repository.count.return_value = 0
        service = CourseService(mock_course_repository)

        # Act
        result = service.get_all_courses()

        # Assert
        assert isinstance(result, CourseListResponse)
        assert len(result.courses) == 0
        assert result.total == 0

    def test_get_all_paginated_success(
        self, mock_course_repository, course_list
    ):
        """Test successful paginated retrieval of courses"""
        # Arrange
        mock_course_repository.get_all_paginated.return_value = course_list[:2]
        mock_course_repository.count.return_value = 3
        service = CourseService(mock_course_repository)

        # Act
        result = service.get_all_paginated(page=1, size=2)

        # Assert
        assert len(result.courses) == 2
        assert result.total == 3
        assert result.page == 1
        assert result.size == 2
        mock_course_repository.get_all_paginated.assert_called_once_with(skip=0, limit=2)

    def test_get_all_paginated_second_page(
        self, mock_course_repository, course_list
    ):
        """Test paginated retrieval of second page"""
        # Arrange
        mock_course_repository.get_all_paginated.return_value = course_list[2:]
        mock_course_repository.count.return_value = 3
        service = CourseService(mock_course_repository)

        # Act
        result = service.get_all_paginated(page=2, size=2)

        # Assert
        assert result.page == 2
        assert result.size == 2
        mock_course_repository.get_all_paginated.assert_called_once_with(skip=2, limit=2)


class TestCourseServiceUpdate:
    """Tests for updating courses"""

    def test_update_course_success(
        self, mock_course_repository, course_model, course_update
    ):
        """Test successful course update"""
        # Arrange
        updated_course = course_model
        updated_course.name = course_update.name
        updated_course.schedule = course_update.schedule

        mock_course_repository.get_by_id.return_value = course_model
        mock_course_repository.update.return_value = updated_course
        service = CourseService(mock_course_repository)

        # Act
        result = service.update_course(1, course_update)

        # Assert
        assert isinstance(result, CourseResponse)
        assert result.name == course_update.name
        assert result.schedule == course_update.schedule
        mock_course_repository.get_by_id.assert_called_once_with(1)
        mock_course_repository.update.assert_called_once()

    def test_update_course_not_found(
        self, mock_course_repository, course_update
    ):
        """Test updating non-existent course raises HTTPException"""
        # Arrange
        mock_course_repository.get_by_id.return_value = None
        service = CourseService(mock_course_repository)

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.update_course(999, course_update)

        assert exc_info.value.status_code == 404
        assert "not found" in exc_info.value.detail
        mock_course_repository.update.assert_not_called()

    def test_update_course_duplicate_code(
        self, mock_course_repository, course_model
    ):
        """Test updating course with duplicate code raises HTTPException"""
        # Arrange
        from src.schemas.course_schema import CourseUpdate
        update_data = CourseUpdate(code="CS999")

        mock_course_repository.get_by_id.return_value = course_model
        mock_course_repository.code_exists.return_value = True
        service = CourseService(mock_course_repository)

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.update_course(1, update_data)

        assert exc_info.value.status_code == 409
        assert "already exists" in exc_info.value.detail
        mock_course_repository.update.assert_not_called()


class TestCourseServiceDelete:
    """Tests for deleting courses"""

    def test_delete_course_success(self, mock_course_repository):
        """Test successful course deletion"""
        # Arrange
        mock_course_repository.exists.return_value = True
        service = CourseService(mock_course_repository)

        # Act
        result = service.delete_course(1)

        # Assert
        assert "message" in result
        assert "deleted successfully" in result["message"]
        mock_course_repository.exists.assert_called_once_with(1)
        mock_course_repository.delete.assert_called_once_with(1)

    def test_delete_course_not_found(self, mock_course_repository):
        """Test deleting non-existent course raises HTTPException"""
        # Arrange
        mock_course_repository.exists.return_value = False
        service = CourseService(mock_course_repository)

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.delete_course(999)

        assert exc_info.value.status_code == 404
        assert "not found" in exc_info.value.detail
        mock_course_repository.delete.assert_not_called()
