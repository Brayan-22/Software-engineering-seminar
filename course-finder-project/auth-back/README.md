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
│           ├── service/                 # Unit tests for AuthService
│           │   └── AuthServiceTest.java
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

### Running Unit Tests
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

#### Example response
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```