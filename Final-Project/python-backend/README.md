# Course Finder API — Python Backend

A FastAPI-based REST API for managing professors, courses, and professor–course assignments.

## ✅ Requirements

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (fast, modern Python package manager)
- PostgreSQL 13+ (installed locally)

## 🚀 Quick Start

### 1) Install `uv`

If you don't have `uv`:

```bash
# Linux / macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2) Install dependencies

```bash
# Sync dependencies (creates a virtualenv automatically)
uv sync

# Include dev extras too (linters, test deps, etc.)
uv sync --all-extras
```

### 3) Configure environment

Create a `.env` file at the project root (or edit the existing one):

```bash
# Database connection (local PostgreSQL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/course_finder_db

# JWT configuration (see Security section)
JWT_PUBLIC_KEY_PATH=keys/public_key.pem
JWT_ALGORITHM=RS256
JWT_AUDIENCE=course-finder-api
JWT_ISSUER=auth-service
```

> Make sure your local PostgreSQL server is running and the database exists. Example:
>
> ```bash
> psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE course_finder_db;"
> # Optionally configure a dedicated user/role and grant privileges.
> ```

### 4) Initialize the database schema

```bash
uv run python -m src.core.init_db
```

### 5) Run the application

**Option A — FastAPI CLI (recommended for development)**
```bash
uv run fastapi dev src/main.py
```

**Option B — Uvicorn directly**
```bash
uv run uvicorn src.main:app --reload
```

### 6) Explore the API

- **Swagger UI**: http://localhost:8000/api/v1/docs
- **ReDoc**: http://localhost:8000/api/v1/redoc
- **Health Check**: http://localhost:8000/health

---

## 📁 Project Structure

```
src/
├── api/
│   ├── __init__.py
│   ├── dependencies/
│   │   ├── __init__.py
│   │   └── auth_dependency.py
│   └── routes/
│       ├── __init__.py
│       ├── assignment.py
│       ├── course.py
│       ├── dashboard.py
│       ├── professor.py
│       └── search.py
├── core/
│   ├── __init__.py
│   ├── config.py
│   ├── database.py
│   └── init_db.py
├── models/
│   ├── __init__.py
│   ├── course.py
│   ├── professor.py
│   └── professor_course.py
├── repositories/
│   ├── __init__.py
│   ├── base.py
│   ├── course_repository.py
│   ├── professor_course_repository.py
│   └── professor_repository.py
├── schemas/
│   ├── __init__.py
│   ├── course_schema.py
│   ├── dashboard_schema.py
│   ├── professor_course_schema.py
│   ├── professor_schema.py
│   └── search_schema.py
├── services/
│   ├── __init__.py
│   ├── course_service.py
│   ├── dashboard_service.py
│   ├── professor_course_manager.py
│   ├── professor_service.py
│   └── search_service.py
├── specifications/
│   ├── __init__.py
│   ├── base.py
│   ├── composite_specifications.py
│   ├── course_specifications.py
│   └── professor_specifications.py
├── main.py
└── tests/
    ├── __init__.py
    ├── conftest.py
    ├── test_course_service.py
    └── test_professor_service.py
```

---

## 🔌 Core Endpoints (CRUD)

### Professors
- `POST /api/v1/professors` — Create professor
- `GET /api/v1/professors` — List professors (paginated)
- `GET /api/v1/professors/{id}` — Get professor by ID
- `PUT /api/v1/professors/{id}` — Update professor
- `DELETE /api/v1/professors/{id}` — Delete professor

### Courses
- `POST /api/v1/courses` — Create course
- `GET /api/v1/courses` — List courses (paginated)
- `GET /api/v1/courses/{id}` — Get course by ID
- `PUT /api/v1/courses/{id}` — Update course
- `DELETE /api/v1/courses/{id}` — Delete course

### Assignments (Professor ⟷ Course)
- `POST /api/v1/assignments` — Create assignment
- `GET /api/v1/assignments` — List assignments
- `GET /api/v1/assignments/{id}` — Get assignment by ID
- `PUT /api/v1/assignments/{id}` — Update assignment status
- `DELETE /api/v1/assignments/{id}` — Remove assignment

---

## 🧪 Testing

```bash
# Run all tests
uv run pytest

# With coverage report
uv run pytest --cov=src --cov-report=html

# Run a specific file
uv run pytest tests/test_course_service.py -q
```

---

## 🗃️ Database Models (overview)

**Professor**
- `id`, `name`, `email` (unique), `specialty`

**Course**
- `id`, `name`, `code` (unique), `category`, `schedule`

**ProfessorCourse** (many‑to‑many link)
- `id`, `professor_id`, `course_id`, `assigned_at`, `status`

---

## 🔐 Security & Authentication (JWT / RSA)

The API validates JWT tokens signed by an external auth service (RSA).

1. Place your public RSA key at `keys/public_key.pem` (create the `keys/` folder if needed).
2. Ensure the following variables exist in your `.env`:
   ```bash
   JWT_PUBLIC_KEY_PATH=keys/public_key.pem
   JWT_ALGORITHM=RS256
   JWT_AUDIENCE=course-finder-api
   JWT_ISSUER=auth-service
   ```

To protect an endpoint, use the provided dependency:

```python
from fastapi import APIRouter, Depends
from src.api.dependencies.auth_dependency import get_current_user

router = APIRouter()

@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    return {"message": "This is protected", "user": current_user}
```

**Available dependencies**
- `get_current_user` — Requires authentication (401 if token is missing/invalid).
- `get_current_user_optional` — Optional authentication (returns `None` if no token).
- `verify_jwt_token` — Only verifies the token (returns full payload).

Send the token using the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## 🛠️ Handy `uv` Commands

```bash
# Add a dependency
uv add <package>

# Add a dev dependency
uv add --dev <package>

# Upgrade locked deps
uv sync --upgrade

# Run inside the project venv
uv run <command>

# Examples
uv run fastapi dev src/main.py
uv run uvicorn src.main:app --reload
uv run pytest
uv pip list
```

---

## 💡 Notes

- `.env` is ignored by Git. Do not commit secrets.
- Keep the public RSA key in sync with the external auth service.
- `aud` and `iss` claims are validated; expired tokens are rejected.