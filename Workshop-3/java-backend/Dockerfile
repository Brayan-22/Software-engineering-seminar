FROM maven:3.9.11-amazoncorretto-25-alpine AS build


WORKDIR /app

COPY pom.xml .

# Descargar las dependencias para cachearlas
RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests


# Runtime para ejecutar la aplicación
FROM amazoncorretto:25-alpine AS runtime

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]