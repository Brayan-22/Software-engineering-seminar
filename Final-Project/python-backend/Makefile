
help:  ## Mostrar ayudas
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ============================================================================
# Poetry - Gestión de dependencias
# ============================================================================

install:  ## Instalar dependencias con Poetry
	poetry install

install-prod:  ## Instalar solo dependencias de producción
	poetry install --only main

update:  ## Actualizar dependencias
	poetry update

lock:  ## Actualizar el archivo de bloqueo de dependencias
	poetry lock

# ============================================================================
# Desarrollo Local
# ============================================================================

dev:  ## Ejecutar servidor de desarrollo con Poetry
	poetry run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

test:  ## Ejecutar tests con Poetry
	poetry run pytest

test-cov:  ## Ejecutar tests con cobertura
	poetry run pytest --cov=src --cov-report=html --cov-report=term

lint:  ## Ejecutar linter (ruff)
	poetry run ruff check src

lint-fix:  ## Corregir problemas de linting automáticamente
	poetry run ruff check --fix src

format:  ## Formatear código con ruff
	poetry run ruff format src

type-check:  ## Verificar tipos con mypy
	poetry run mypy src

clean:  ## Limpiar archivos temporales
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	rm -rf htmlcov .coverage

# ============================================================================
# Build - Construcción de imágenes Docker
# ============================================================================

build:  ## Construir imagen Docker
	docker build -t python-backend:latest .

build-no-cache:  ## Construir imagen Docker sin cache
	docker build --no-cache -t python-backend:latest .

# ============================================================================
# Compose - Docker Compose
# ============================================================================

compose-up:  ## Levantar servicios con docker compose
	docker compose up -d

compose-up-build:  ## Levantar servicios y reconstruir imágenes
	docker compose up -d --build

compose-down:  ## Detener servicios de docker compose
	docker compose down


# ============================================================================
# Stack - Docker Swarm
# ============================================================================

stack-deploy:  ## Desplegar stack en Docker Swarm
	docker stack deploy -c docker-stack.yml python-backend

stack-remove:  ## Eliminar stack de Docker Swarm
	docker stack rm python-backend

stack-ps:  ## Listar servicios del stack
	docker stack ps python-backend

stack-services:  ## Listar servicios del stack con detalles
	docker stack services python-backend
