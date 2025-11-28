.PHONY: help install run db-init db-up

help:  ## Mostrar ayudas
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

install:  ## Instalar depnendicias de python
	uv sync

run:  ## Ejecutar la aplicacion
	uv run fastapi dev src/main.py

db-up:  ## Levantar la base de datos con docker
	docker-compose up -d

db-init:  ## Inicializar tablas en la base de datos
	uv run python -m src.core.init_db
