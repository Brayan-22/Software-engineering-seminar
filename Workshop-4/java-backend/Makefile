
help:  ## Mostrar ayudas
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ============================================================================
# Maven - Gestión de dependencias
# ============================================================================

install:  ## Instalar dependencias
	mvn clean package

# ============================================================================
# Desarrollo Local
# ============================================================================

dev:
	mvn clean spring-boot:run

# ============================================================================
# Build - Construcción de imágenes Docker
# ============================================================================

build:  ## Construir imagen Docker
	docker build -t java-backend:latest .

build-no-cache:  ## Construir imagen Docker sin cache
	docker build --no-cache -t java-backend:latest .

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
	docker stack deploy -c docker-stack.yml java-backend

stack-remove:  ## Eliminar stack de Docker Swarm
	docker stack rm java-backend

stack-ps:  ## Listar servicios del stack
	docker stack ps java-backend

stack-services:  ## Listar servicios del stack con detalles
	docker stack services java-backend
