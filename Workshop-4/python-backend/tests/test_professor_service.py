"""
Unit tests for ProfessorService

Tests the business logic layer for professor operations.
"""
import pytest
from fastapi import HTTPException

from src.services.professor_service import ProfessorService
from src.schemas.professor_schema import ProfessorResponse, ProfessorListResponse


class TestProfessorServiceCreate:
    """Tests for creating professors"""

    def test_create_professor_success(
        self, mock_professor_repository, professor_create, professor_model
    ):
        """Test successful professor creation"""
        # Arrange
        mock_professor_repository.email_exists.return_value = False
        mock_professor_repository.create.return_value = professor_model
        service = ProfessorService(mock_professor_repository)

        # Act
        result = service.create_professor(professor_create)

        # Assert
        assert isinstance(result, ProfessorResponse)
        assert result.name == professor_model.name
        assert result.email == professor_model.email
        assert result.specialty == professor_model.specialty
        mock_professor_repository.email_exists.assert_called_once_with(professor_create.email)
        mock_professor_repository.create.assert_called_once()

    def test_create_professor_duplicate_email(
        self, mock_professor_repository, professor_create
    ):
        """Test creating professor with duplicate email raises HTTPException"""
        # Arrange
        mock_professor_repository.email_exists.return_value = True
        service = ProfessorService(mock_professor_repository)

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.create_professor(professor_create)

        assert exc_info.value.status_code == 409
        assert "already exists" in exc_info.value.detail
        mock_professor_repository.create.assert_not_called()


class TestProfessorServiceRead:
    """Tests for reading professors"""

    def test_get_professor_by_id_success(
        self, mock_professor_repository, professor_model
    ):
        """Test successful retrieval of professor by ID"""
        # Arrange
        mock_professor_repository.get_by_id.return_value = professor_model
        service = ProfessorService(mock_professor_repository)

        # Act
        result = service.get_professor_by_id(1)

        # Assert
        assert isinstance(result, ProfessorResponse)
        assert result.id == professor_model.id
        assert result.name == professor_model.name
        assert result.email == professor_model.email
        mock_professor_repository.get_by_id.assert_called_once_with(1)

    def test_get_professor_by_id_not_found(self, mock_professor_repository):
        """Test getting non-existent professor raises HTTPException"""
        # Arrange
        mock_professor_repository.get_by_id.return_value = None
        service = ProfessorService(mock_professor_repository)

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.get_professor_by_id(999)

        assert exc_info.value.status_code == 404
        assert "not found" in exc_info.value.detail

    def test_get_all_professors_success(
        self, mock_professor_repository, professor_list
    ):
        """Test successful retrieval of all professors"""
        # Arrange
        mock_professor_repository.get_all.return_value = professor_list
        mock_professor_repository.count.return_value = len(professor_list)
        service = ProfessorService(mock_professor_repository)

        # Act
        result = service.get_all_professors()

        # Assert
        assert isinstance(result, ProfessorListResponse)
        assert len(result.professors) == 3
        assert result.total == 3
        mock_professor_repository.get_all.assert_called_once()
        mock_professor_repository.count.assert_called_once()

    def test_get_all_professors_empty(self, mock_professor_repository):
        """Test getting all professors when none exist"""
        # Arrange
        mock_professor_repository.get_all.return_value = []
        mock_professor_repository.count.return_value = 0
        service = ProfessorService(mock_professor_repository)

        # Act
        result = service.get_all_professors()

        # Assert
        assert isinstance(result, ProfessorListResponse)
        assert len(result.professors) == 0
        assert result.total == 0

    def test_get_all_paginated_success(
        self, mock_professor_repository, professor_list
    ):
        """Test successful paginated retrieval of professors"""
        # Arrange
        mock_professor_repository.get_all_paginated.return_value = professor_list[:2]
        mock_professor_repository.count.return_value = 3
        service = ProfessorService(mock_professor_repository)

        # Act
        result = service.get_all_paginated(page=1, size=2)

        # Assert
        assert len(result.professors) == 2
        assert result.total == 3
        assert result.page == 1
        assert result.size == 2
        mock_professor_repository.get_all_paginated.assert_called_once_with(skip=0, limit=2)

    def test_get_all_paginated_second_page(
        self, mock_professor_repository, professor_list
    ):
        """Test paginated retrieval of second page"""
        # Arrange
        mock_professor_repository.get_all_paginated.return_value = professor_list[2:]
        mock_professor_repository.count.return_value = 3
        service = ProfessorService(mock_professor_repository)

        # Act
        result = service.get_all_paginated(page=2, size=2)

        # Assert
        assert result.page == 2
        assert result.size == 2
        mock_professor_repository.get_all_paginated.assert_called_once_with(skip=2, limit=2)


class TestProfessorServiceUpdate:
    """Tests for updating professors"""

    def test_update_professor_success(
        self, mock_professor_repository, professor_model, professor_update
    ):
        """Test successful professor update"""
        # Arrange
        updated_professor = professor_model
        updated_professor.name = professor_update.name
        updated_professor.specialty = professor_update.specialty

        mock_professor_repository.get_by_id.return_value = professor_model
        mock_professor_repository.update.return_value = updated_professor
        service = ProfessorService(mock_professor_repository)

        # Act
        result = service.update_professor(1, professor_update)

        # Assert
        assert isinstance(result, ProfessorResponse)
        assert result.name == professor_update.name
        assert result.specialty == professor_update.specialty
        mock_professor_repository.get_by_id.assert_called_once_with(1)
        mock_professor_repository.update.assert_called_once()

    def test_update_professor_not_found(
        self, mock_professor_repository, professor_update
    ):
        """Test updating non-existent professor raises HTTPException"""
        # Arrange
        mock_professor_repository.get_by_id.return_value = None
        service = ProfessorService(mock_professor_repository)

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.update_professor(999, professor_update)

        assert exc_info.value.status_code == 404
        assert "not found" in exc_info.value.detail
        mock_professor_repository.update.assert_not_called()

    def test_update_professor_duplicate_email(
        self, mock_professor_repository, professor_model
    ):
        """Test updating professor with duplicate email raises HTTPException"""
        # Arrange
        from src.schemas.professor_schema import ProfessorUpdate
        update_data = ProfessorUpdate(email="existing@university.edu")

        mock_professor_repository.get_by_id.return_value = professor_model
        mock_professor_repository.email_exists.return_value = True
        service = ProfessorService(mock_professor_repository)

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.update_professor(1, update_data)

        assert exc_info.value.status_code == 409
        assert "already exists" in exc_info.value.detail
        mock_professor_repository.update.assert_not_called()


class TestProfessorServiceDelete:
    """Tests for deleting professors"""

    def test_delete_professor_success(self, mock_professor_repository):
        """Test successful professor deletion"""
        # Arrange
        mock_professor_repository.exists.return_value = True
        service = ProfessorService(mock_professor_repository)

        # Act
        result = service.delete_professor(1)

        # Assert
        assert "message" in result
        assert "deleted successfully" in result["message"]
        mock_professor_repository.exists.assert_called_once_with(1)
        mock_professor_repository.delete.assert_called_once_with(1)

    def test_delete_professor_not_found(self, mock_professor_repository):
        """Test deleting non-existent professor raises HTTPException"""
        # Arrange
        mock_professor_repository.exists.return_value = False
        service = ProfessorService(mock_professor_repository)

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            service.delete_professor(999)

        assert exc_info.value.status_code == 404
        assert "not found" in exc_info.value.detail
        mock_professor_repository.delete.assert_not_called()
