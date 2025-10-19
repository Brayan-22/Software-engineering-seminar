# Academic Course Finder – Workshop 2 Documentation

This repository contains the design documentation and UI mockups for **Workshop 2: Application Design and UI Progress** of the Academic Course Finder Web Application.

---

## Project Overview

**Objective:**
Design and document the technical architecture and user interface for a web application that allows administrators to manage teachers and courses (CRUD operations), while enabling users to search for academic information without authentication.

**Workshop Focus:**
This workshop focuses on creating comprehensive design diagrams and mockups that will guide the development phase, including class diagrams, deployment architecture, system architecture, activity diagrams, and web UI mockups.

---

## Design Artifacts

This workshop delivers five key design components that define the system's structure, behavior, and deployment:

### 1. Class Diagram

The **UML Class Diagram** describes the object-oriented structure of the Course Finder application, organized into distinct layers following a layered architecture pattern.

#### Key Components:
- **Controllers Layer** – Handles HTTP requests and routes them to appropriate services:
  - `ProfessorController` – Manages professor-related endpoints
  - `CourseController` – Manages course-related endpoints
  - `AssignmentController` – Handles professor-course assignments
  - `SearchController` – Provides search functionality
  - `DashboardController` – Admin dashboard operations
  - `AuthController` – Authentication and authorization

- **Business Services Layer** – Contains business logic:
  - `ProfessorCourseManager` – Manages relationships between professors and courses
  - `SearchService` – Implements search algorithms
  - `Dashboard` – Dashboard data aggregation
  - `AuthService` – Authentication logic

- **Data Access Layer** – Repositories for database operations:
  - `ProfessorRepository` – Professor CRUD operations
  - `CourseRepository` – Course CRUD operations
  - `ProfessorCourseRepository` – Assignment management
  - `AdminRepository` – Admin user management

- **Domain Model** – Core business entities:
  - `Professor` – Represents academic professors
  - `Course` – Represents academic courses
  - `Admin` – Administrator users
  - `ProfessorCourse` – Many-to-many relationship entity

**Reference:** See `1_ClassDiagram.pdf` for the complete diagram.

---

### 2. Architecture Diagram

The **System Architecture Diagram** illustrates the layered architecture approach used in the Course Finder application.

#### Architecture Layers:

**Presentation Layer:**
- React SPA (Single Page Application)
  - Search UI – Public interface for searching courses and professors
  - Admin Dashboard – Administrative interface for CRUD operations
  - CRUD Forms – Forms for managing professors and courses

**Gateway Layer:**
- Nginx – Reverse proxy for routing requests

**Services Layer:**

*Auth Service (Separate microservice):*
- Controllers: `AuthController`
- Services: `AuthService`, `TokenManager`
- Repositories: `AdminRepository`
- Database: `professors_courses_db`

*Business Service (Main application):*
- Controllers: `AssignmentController`, `ProfessorController`, `CourseController`, `SearchController`, `DashboardController`
- Services: `ProfessorCourseManager`, `SearchService`, `Dashboard`
- Repositories: `ProfessorCourseRepository`, `CourseRepository`, `ProfessorRepository`
- Database: `professors_courses_db`

**Key Architectural Decisions:**
- Layered architecture for separation of concerns
- Separate authentication service for security isolation
- Shared database for simplicity (can be split in future for microservices)
- React SPA for responsive, modern user experience
- Nginx as API gateway and reverse proxy

**Reference:** See `4_ArchitectureDiagram.pdf` for the complete diagram.

---

### 3. Deployment Diagram

The **Deployment Architecture** shows the physical deployment of the system on AWS Cloud infrastructure.

#### Deployment Components:

**AWS Cloud Infrastructure:**

1. **CloudFront + S3 Bucket (Static Hosting):**
   - Hosts the React SPA (HTML/CSS/JS files)
   - Provides CDN distribution for fast global access
   - Users access the application through CloudFront

2. **VPC (10.0.0.0/16):**

   *Public Subnet (10.0.1.0/24):*
   - **EC2 Instance (Ubuntu)**
     - Runs Docker Compose orchestration
     - Contains:
       - **Nginx (:80)** – Routes requests to backend services
       - **Auth Service (:8081)** – Java-based authentication service
       - **Business Service (:8082)** – Python-based main application

   *Private Subnet (10.0.2.0/24):*
   - **RDS PostgreSQL**
     - Database: `professors_courses_db`
     - Not directly accessible from internet
     - Accessed only by services in the public subnet

**Communication Flow:**
1. Users (Public/Admins) send requests to CloudFront
2. Static resources served from S3
3. API requests forwarded to Nginx on EC2
4. Nginx routes to appropriate service (Auth/Business)
5. Services access RDS PostgreSQL database

**Reference:** See `2_DeploymentDiagram.pdf` for the complete diagram.

---

### 4. Activity Diagram

The **Activity Diagram** represents the business process flow for the admin user registration and authentication workflow.

#### Process Flow:

1. **User starts** registration/login process
2. **Admin validation:**
   - System validates admin credentials
   - If valid → Proceed to user validation
   - If invalid → Return error and restart

3. **User credential validation:**
   - System validates user credentials
   - If valid → Grant access
   - If invalid → Return error

4. **Session management:**
   - User logged in successfully
   - System validates operations
   - Admin can perform authorized actions

5. **Process end** when user logs out

**Reference:** See `3_Activity_Diagram.pdf` for the complete diagram.

---

### 5. Web UI Mockups

The **Web UI Mockups** showcase the user interface design for both public users and administrators.

#### Implemented Mockups:

**Public User Interface:**

1. **Search Interface (Home Page)**
   - Search bar for professors or courses
   - Clean, minimal design
   - Accessible without authentication

2. **Search Results - Empty State**
   - Displays when search is initiated
   - Ready to show results dynamically

3. **Search Results - Professors Teaching a Course**
   - Shows list of professors teaching a specific course
   - Displays: Name, Code, Email
   - Example: "Professors teaching Calculus"

4. **Search Results - Courses by Professor**
   - Shows courses taught by a specific professor
   - Displays: Course Name, Group, Schedule
   - Example: "Courses taught by: Dr. John Smith"

**Admin Interface:**

5. **Admin Login Page**
   - Secure authentication form
   - User and password fields
   - Password recovery option

6. **Admin Panel - Courses Management**
   - CRUD operations for courses
   - List view with Edit/Delete actions
   - Add new course button (+)
   - Displays: Name, Group, Schedule

7. **Admin Panel - Professors Management**
   - CRUD operations for professors
   - List view with Edit/Delete actions
   - Add new professor button (+)
   - Displays: Name, Code, Email

8. **Admin Panel - Assignments**
   - Tab for managing professor-course assignments
   - Links professors to their courses


**Reference:** See `5. WebUI MockUps.pdf` for all mockup screens.

---

## Technical Stack

Based on the design diagrams, the following technology stack is proposed:

### Frontend
- **Framework:** React (SPA)
- **Hosting:** AWS S3 + CloudFront
- **Build Tools:** Javascript

### Backend
- **Auth Service:** Java (Port 8081)
- **Business Service:** Python (Port 8082)
- **API Gateway:** Nginx (Port 80)
- **Containerization:** Docker Compose

### Database
- **DBMS:** PostgreSQL
- **Hosting:** AWS RDS
- **Database Name:** `professors_courses_db`

### Cloud Infrastructure
- **Provider:** AWS
- **Services:** EC2, RDS, S3, CloudFront, VPC
- **Networking:** VPC with public and private subnets

---

## Architecture Patterns

The system follows several software engineering best practices:

1. **Layered Architecture**
   - Clear separation between Presentation, Business, and Data layers
   - Promotes maintainability and testability

2. **Repository Pattern**
   - Abstracts data access logic
   - Enables easier database migrations and testing

3. **Service Layer Pattern**
   - Encapsulates business logic
   - Reusable across different controllers

4. **MVC Pattern**
   - Controllers handle routing
   - Services contain business logic
   - Repositories manage data access

5. **Services Approach**
   - Separate Auth service for security concerns
   - Can be scaled independently

---

## Project Team

**Universidad Distrital Francisco José de Caldas**
Systems Engineering Program
Software Engineering Seminar

**Team Members:**
- Brayan Alejandro Riveros Rodríguez (20201020084)
- Carlos Andrés Pescador Castro (20182020139)
- Cristian Santiago Ríos Vásquez (20201020107)
