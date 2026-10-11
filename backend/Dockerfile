# Multi-stage Dockerfile optimized for Render & Cloud deployment
# Stage 1: Build JAR using Maven 3.9 & Java 17
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source and build executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user and uploads directory for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && mkdir -p /app/uploads \
    && chown -R appuser:appgroup /app

USER appuser

# Copy built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render injects the PORT environment variable (defaults to 8080 if not set)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
