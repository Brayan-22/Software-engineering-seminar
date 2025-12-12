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
