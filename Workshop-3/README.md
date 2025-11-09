# Auth-Back – Java Spring Boot Authentication Backend

This project is the authentication backend for the **Course Finder System**, developed using **Java Spring Boot**.  
It handles administrator login using **JWT (JSON Web Token)** and connects to a **MySQL** database for user management.

---

## Features

- Admin login using **username** and **password**.
- Token-based authentication with **JWT**.
- Password encryption using **Spring Security**.
- Integration with **MySQL** database.
- Unit tests implemented with **JUnit 5** and **Mockito**.

---

## Technologies Used

| Layer             | Technology            |
|-------------------|-----------------------|
| Backend Framework | Spring Boot 3.5.7     |
| Database          | MySQL 8               |
| ORM               | Spring Data JPA       |
| Security          | JWT (io.jsonwebtoken) |
| Testing           | JUnit 5 + Mockito     |
| Build Tool        | Maven                 |
| Language          | Java 21               |

---

## Project Structure

```
auth-back/
├── init_db_scripts/                     # SQL scripts for database initialization
│    ├── schema_db.sql
│    └── data_db.sql
├── src/
│   ├── main/
│   │   ├── java/com/udistrital/authback/
│   │   │   ├── config/                  # Security configuration
│   │   │   ├── controller/              # REST controllers
│   │   │   ├── dto/                     # Data Transfer Objects
│   │   │   ├── entity/                  # JPA entities
│   │   │   ├── repository/              # JPA repositories
│   │   │   ├── security/                # JWT utilities and token management
│   │   │   ├── service/                 # Business logic
│   │   │   └── AuthBackApplication.java # Spring Boot main class
│   │   └── resources/                   # Application configuration and assets
│   └── test/
│       └── java/com/udistrital/authback/
│           ├── security/
│           │   └── JwtUtilTest.java     # Unit tests for JwtUtil
│           ├── service/                 
│           │   └── AuthServiceTest.java # Unit tests for AuthService   
│           └── AuthBackApplicationTests.java  # Spring Boot context test
```



---

## Database Configuration (MySQL)

### Database Script

Create the database and table using the following script (already included in `/init_db_scripts/schema_db.sql`):

```sql
-- Script:schema_db.sql
-- Database: auth_db_course

CREATE DATABASE IF NOT EXISTS auth_db_course CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE auth_db_course;

DROP TABLE IF EXISTS admins;

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
### Connection Settings

Add your MySQL credentials in the file:
```
src/main/resources/application.properties
```

Example configuration:
```
DATABASE CONNECTION

spring.datasource.url=jdbc:mysql://localhost:3306/auth_db_course?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

JPA / HIBERNATE

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

SERVER

server.port=8080
```

Replace **YOUR_PASSWORD** with your actual MySQL root password.

### Testing the Connection

Run the following command to start the backend:
```
mvn spring-boot:run
```

If successful, you should see output similar to:
```
Tomcat initialized with port 8080 (http)
Started AuthBackApplication in 3.2 seconds
```

## Running Unit Tests
This project includes unit tests for authentication logic.

Run all tests using:
```
mvn test
```

Expected output:
```
Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```
#### Unit Test Results

![AuthServiceTest](https://i.imgur.com/ftaVBUZ.png)

This screenshot shows the successful execution of the unit tests for the AuthService class.
These tests validate the authentication logic, including:

- Successful login: verifies that a valid username and password produce a JWT token.


- Invalid password: ensures that incorrect credentials trigger an exception.


- User not found: confirms that the service correctly handles missing users in the repository.

All test cases passed, confirming that the authentication flow behaves as expected and interacts properly with mocked dependencies (AdminRepository, PasswordEncoder, and JwtUtil).

![JwtUtilTest](https://i.imgur.com/Q8KZxDu.png)

This screenshot displays the successful execution of the unit tests for the JwtUtil class.
These tests verify the correct generation and validation of JWT tokens, ensuring that:

- Tokens are generated with a valid signature (RS256) using the configured private key.


- The generated token contains the expected claims (username, issued date, expiration).


- Token expiration logic functions correctly within the defined time window.

All tests passed, confirming that the JWT generation and signing process works reliably.

## REST API Documentation

This backend provides a simple **authentication service using JWT tokens**.  
All endpoints are documented and available through **Swagger UI**.

### 🔹 Accessing Swagger UI

Once the backend is running (for example, at `http://localhost:8080`),  
you can open the API documentation in your browser at:

**http://localhost:8080/swagger-ui/index.html**

![Swagger](https://i.imgur.com/bBPolrC.png)

Swagger UI provides an interactive interface where you can:
- Explore all available REST endpoints.
- Test requests directly from the browser.
- View response formats and status codes.

### API Endpoint
| Method | Endpoint          | Description                                     |
|--------|-------------------|-------------------------------------------------|
| `POST` | `/api/auth/login` | Authenticates an admin and returns a JWT token. |


#### Example request (JSON)
```
{
  "username": "admin",
  "password": "admin123"
}
```
![Login Endpoint](https://i.imgur.com/6Y8zh2n.png)
#### Example response
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```
![Login Endpoint](https://i.imgur.com/cp18UZg.png)


Pille el de python si quiere cambielo: 
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


# Frontend Setup

This guide explains how to set up and run the frontend application for Workshop 3. The frontend interacts with two backend APIs: the authentication backend and the course management backend.

## Directory Structure

The repository is organized as follows:

```
Workshop/
├─ Workshop 1/
├─ Workshop 2/
├─ Workshop 3/
│  ├─ backend-auth/
│  ├─ backend-course/
│  └─ frontend-app/
```

All setup instructions should be executed from the `frontend-app` directory.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A running instance of both backend APIs

## Setup Instructions

1. Open a terminal and navigate to the frontend directory:

```bash
cd Workshop-3/frontend-app
```

2. Install dependencies:

```bash
npm install
```

3. Configure API endpoints (if necessary):

By default, the frontend uses the following base URLs configured via proxy:

- Course API: `/course-api`
- Auth API: `/auth-api`

Update `src/api/` files if your backend URLs differ.

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and visit:

```
http://localhost:5173
```

You should see the frontend running and ready to interact with the backends.

## Notes

- Ensure that both backend servers are running before launching the frontend.
- Tokens will be stored in `localStorage` for API authentication.
- For production builds, use:

```bash
npm run build
npm run preview
```

This will generate optimized assets in the `dist/` folder and serve them locally.

## References

- [Vite Documentation](https://vite.dev/)
- [Axios Documentation](https://axios-http.com/)
- [MUI Documentation](https://mui.com/material-ui/all-components/)
