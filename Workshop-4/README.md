# Workshop No. 4 - Containerization, Acceptance, and CI/CD

**Software Engineering Seminar**
**Universidad Distrital Francisco José de Caldas**
**Systems Engineering**


---

## Table of Contents

1. [Containerization](#1-containerization)
   - [Dockerfiles](#11-dockerfiles)
   - [Docker Compose Configuration](#12-docker-compose-configuration)
   - [Makefile Usage](#13-makefile-usage)
   - [Running Tests](#14-running-tests)
   - [Summary](#15-summary)
2. [Frontend Acceptance Tests with Cucumber](#2-frontend-acceptance-tests-with-cucumber)
3. [GitHub Actions Workflow](#3-github-actions-workflow)
4. [Conclusion](#4-conclusion)
5. [Team Members](#team-members)

---

## 1. Containerization

### 1.1 Dockerfiles

For this project, each backend includes a custom Dockerfile. The goal of these Dockerfiles is to produce lightweight and efficient container images ready for deployment in local and production environments.

#### 1.1.1 Java Backend

The Java backend Dockerfile uses a **multi-stage build**. In the first stage, Maven downloads all dependencies and creates the application JAR file. In the second stage, a smaller Amazon Corretto runtime image is used to run the final application. This approach reduces the final image size and improves performance. The container exposes port 8080 and runs the service using a simple `java -jar` command.

```dockerfile
# === Build Stage ===
FROM maven:3.9.11-amazoncorretto-25-alpine AS build
WORKDIR /app

# Copy and prepare dependency configuration
COPY pom.xml .

# Download and cache dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build project while skipping tests
RUN mvn clean package -DskipTests

# === Runtime Stage ===
FROM amazoncorretto:25-alpine AS runtime
WORKDIR /app

# Copy the packaged JAR file
COPY --from=build /app/target/*.jar app.jar

# Expose service port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### 1.1.2 Python Backend

The Python backend Dockerfile also uses a **multi-stage build**. The first stage installs dependencies using Poetry and creates a virtual environment inside the project folder. The second stage copies the virtual environment and application code into a clean Python 3.11 image. A non-root user is created for security, and the service is started using Uvicorn on port 8000. A health check is also included to verify that the API is running correctly.

#### 1.1.3 Frontend

The Frontend Dockerfile uses a multi-stage build with Node.js for building and Nginx for serving. The build stage installs dependencies and generates a production build using Vite. The production stage copies the build output to an Nginx container and applies a custom configuration for proper routing and API proxying.

These Dockerfiles allow all services to run consistently across different environments and ensure that all dependencies and runtime configurations are properly isolated inside each container.

---

### 1.2 Docker Compose Configuration

To orchestrate the application components, we created multiple `docker-compose.yml` and `docker-stack.yml` files for development and deployment. These files define how each container interacts with its database and with the reverse proxy when needed.

#### 1.2.1 Local Deployment

For local development, Docker Compose builds the images directly from the Dockerfiles and maps the service ports to the host machine.

**For the Java backend**, the compose file includes a MySQL database initialized with SQL scripts:

```yaml
version: '3.8'
services:
  java-backend:
    image: java-backend:latest
    build:
      context: .
      dockerfile: Dockerfile
    container_name: java-backend
    ports:
      - "8080:8080"
    env_file:
      - .env
    depends_on:
      - java-backend-db
    networks:
      - java-backend-network

  java-backend-db:
    image: mysql:8.0
    container_name: java-backend-db
    env_file:
      - .env
    volumes:
      - ./init_db_scripts/schema_db.sql:/docker-entrypoint-initdb.d/schema_db.sql
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - java-backend-network

volumes:
  db_data:

networks:
  java-backend-network:
    driver: bridge
```

**For the Python backend**, the compose file includes a PostgreSQL database with its initialization scripts and health checks.

Both services load environment variables from `.env` files and wait for the databases to become healthy before starting.

#### 1.2.2 Production Deployment

For production, the `docker-stack.yml` files define the same services but include additional configuration such as replicas, restart policies, placement constraints, and **Traefik labels**. These labels allow each backend to be published through HTTPS using different hostnames and connected to a shared reverse proxy network.

Using Docker Compose and Docker Swarm makes it possible to run the system as a group of independent services while keeping the configuration simple, repeatable, and easy to deploy.

---

### 1.3 Makefile Usage

The backends also include a **Makefile** to simplify common tasks. This file includes commands for installing dependencies, running tests, linting the code, cleaning temporary files, building Docker images, and deploying the stack in Docker Swarm. These Makefiles help maintain a clean and consistent workflow for all team members.

**Example targets for Java Backend:**
- `make install` - Install dependencies
- `make dev` - Run in development mode
- `make build` - Build Docker image
- `make compose-up` - Start with Docker Compose
- `make stack-deploy` - Deploy to Docker Swarm

**Example targets for Python Backend:**
- `make install` - Install dependencies with Poetry
- `make test` - Run tests
- `make lint` - Check code quality
- `make build` - Build Docker image
- `make stack-deploy` - Deploy to Docker Swarm

---

### 1.4 Running Tests

Both backend services include comprehensive test suites to ensure code quality and functionality. Each service can be tested independently using its respective testing framework.

#### 1.4.1 Java Backend - Unit Tests

The Java backend uses **JUnit 5** and **Mockito** for unit testing. The test suite includes tests for authentication logic, JWT utilities, and service layers.

**Running tests:**

```bash
# Navigate to the Java backend directory
cd backend-auth

# Run all tests
mvn test

# Run tests with detailed output
mvn test -X

# Run a specific test class
mvn test -Dtest=AuthServiceTest

# Run tests and generate coverage report
mvn test jacoco:report
```

**Test Structure:**
- `src/test/java/com/udistrital/authback/security/JwtUtilTest.java` - JWT token generation and validation
- `src/test/java/com/udistrital/authback/service/AuthServiceTest.java` - Authentication service logic
- `src/test/java/com/udistrital/authback/AuthBackApplicationTests.java` - Spring Boot context tests

**Expected Output:**
```
Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

#### 1.4.2 Python Backend - Unit Tests

The Python backend uses **pytest** for unit testing. The test suite covers service layers, repository patterns, and API endpoint validations.

**Running tests:**

```bash
# Navigate to the Python backend directory
cd backend-course

# Run all tests
poetry run pytest

# Run tests with verbose output
poetry run pytest -v

# Run tests with coverage report
poetry run pytest --cov=src --cov-report=html --cov-report=term

# Run a specific test file
poetry run pytest tests/test_professor_service.py

# Run tests in parallel (faster execution)
poetry run pytest -n auto
```

**Alternative using Make:**
```bash
# Run tests
make test

# Run tests with coverage
make test-cov
```

**Test Structure:**
- `tests/test_professor_service.py` - Professor service unit tests
- `tests/test_course_service.py` - Course service unit tests
- `tests/conftest.py` - Test fixtures and configuration

**Expected Output:**
```
============================= test session starts ==============================
collected 15 items

tests/test_course_service.py ........                                    [ 53%]
tests/test_professor_service.py .......                                  [100%]

============================== 15 passed in 2.34s ==============================
```

---

### 1.5 Summary

In summary, the containerization process provides a complete and isolated environment for all services. The Dockerfiles create optimized and lightweight images, while the Compose and Stack files configure the services, databases, networks, and the reverse proxy for different environments.

In addition to this, both backends include:
- **Makefiles** that automate common tasks such as installing dependencies, running the application in development mode, building Docker images, and deploying the services with Docker Swarm
- **Comprehensive test suites** using JUnit 5/Mockito for Java and pytest for Python, ensuring code quality and reliability
- **Simple commands** for running tests with coverage reports and detailed output

These Makefiles and testing tools help maintain a consistent workflow and make the development, testing, and deployment process faster and easier. Overall, these containers and testing infrastructure make the project simple to run, validate, and deploy in both development and production environments.

---

## 2. Frontend Acceptance Tests with Cucumber

Frontend acceptance tests were implemented using **Cucumber** to validate critical user stories from the perspective of the final user. These tests ensure that the user interface responds correctly to user actions such as form submissions, navigation, and data validation.

For detailed information about the acceptance tests, including test scenarios, step definitions, and execution results, please refer to:

**📄 [TEST-ACCEPTANCE.md](./TEST-ACCEPTANCE.md)**

### Key Highlights

- **Feature Tested:** Create Professor
- **Test Framework:** Cucumber with Gherkin syntax
- **Scenarios Covered:**
  - Access the professor registration form
  - Register a teacher with valid data
  - Validate required fields
  - Prevent duplicate teacher registration

The acceptance tests provide living documentation of expected system behavior and establish a baseline for future frontend validations.

---

## 3. GitHub Actions Workflow

### 3.1 Overview

For this project, we created a GitHub Actions workflow to automate important tasks such as running tests and building Docker images. The goal of this workflow is to support **continuous integration and continuous delivery (CI/CD)**. Each time we push new code to the repository, the workflow runs automatically and checks that the system continues to work correctly.

Using a **multi-workflow CI architecture** allows each service to be tested in isolation using the runtime and database it requires. The Java backend runs against MySQL, the Python backend against PostgreSQL, and the frontend uses Node.js tooling—each with its own optimized environment.

### 3.2 Workflow Structure

The repository contains four workflow files:

- **`workshop4-ci.yaml`** - Unified pipeline that validates the full system
- **`frontend-ci.yaml`** - CI pipeline for the frontend service
- **`java-backend.yaml`** - CI pipeline for the Java backend
- **`python-backend.yaml`** - CI pipeline for the Python backend

This structure makes the CI process modular, scalable, and aligned with real-world production pipelines.

#### 3.2.1 Frontend Workflow

The frontend workflow focuses on the Node.js environment:
1. Install Node.js dependencies via npm
2. Run linting and static analysis tools
3. Build the production-ready Vite bundle

#### 3.2.2 Java Backend Workflow

The Java backend workflow uses Maven and runs against a MySQL service:
1. Configure the Java 21 (Corretto) environment
2. Restore Maven dependencies to speed up builds
3. Run unit and integration tests
4. Package the application into a JAR file
5. Build the Docker image

#### 3.2.3 Python Backend Workflow

The Python backend workflow creates an isolated Python environment:
1. Set up Python 3.11 and install dependencies via Poetry
2. Run unit tests and API-level tests
3. Validate the FastAPI application
4. Build the Docker image

### 3.3 Automatic Testing

A key part of the CI pipeline is the execution of automated tests. Whenever a workflow runs:
- All unit and integration tests are executed
- Any failure immediately stops the workflow
- Clear logs and error messages are reported in GitHub Actions

### 3.4 Docker Image Build

Each backend workflow builds its corresponding Docker image:
- Ensuring Dockerfiles remain functional
- Verifying that the services can be containerized at any time
- Guaranteeing consistency between development and production environments

### 3.5 Summary

The GitHub Actions setup provides a robust, automated pipeline for validating the entire system. By combining a unified workflow with service-specific pipelines, the project benefits from fast feedback, cleaner code, and reliable CI/CD practices. This design reduces manual intervention, improves code quality, and ensures that every commit is thoroughly tested.

---

## 4. Conclusion

This workshop demonstrated the implementation of modern software engineering practices through **containerization**, **frontend acceptance testing**, and **continuous integration**. Each of the objectives set for this project was addressed systematically:

### Docker Containerization
All components of the system—including the Java backend, Python backend, and frontend—were successfully containerized. The use of multi-stage Dockerfiles ensured lightweight and optimized images, while Docker Compose and Docker Swarm orchestrations allowed seamless deployment in both development and production environments. The containers guarantee environment consistency, reduce dependency conflicts, and simplify setup for developers and testers.

### Acceptance Testing with Cucumber
Frontend acceptance tests were implemented using Cucumber to validate critical user stories. The **Create Professor** feature illustrated how administrators interact with the system, covering scenarios such as form access, valid teacher registration, required field validation, and duplicate prevention. Although some steps failed, the test provided valuable feedback on UI behavior and set a foundation for future automated frontend validations.

### CI/CD Pipeline
A modular CI/CD pipeline using GitHub Actions was created for the entire project. Each service—frontend, Java backend, and Python backend—has dedicated workflows for installing dependencies, running tests, and building Docker images. A unified workflow was also implemented to ensure system-wide integrity. This setup enforces consistent quality, detects regressions early, and streamlines deployment processes.

### Overall Impact
By combining these practices, the project achieved reproducible deployments, reliable validation of user-facing features, and automated system verification. The outcomes highlight the importance of these methodologies in maintaining code quality, reducing manual effort, and ensuring smooth collaboration across development teams.

---

## Team Members

**Presented by:**

- **Brayan Alejandro Riveros Rodríguez** - 20201020084
- **Carlos Andrés Pescador Castro** - 20182020139
- **Cristian Santiago Ríos Vásquez** - 20201020107

---

*Universidad Distrital Francisco José de Caldas*
*Systems Engineering Program*
*Software Engineering Seminar*
*Bogotá D.C., Colombia - November 29, 2025*
