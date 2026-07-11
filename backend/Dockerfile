# ---------- Stage 1: Build ----------
# We use a full Maven+JDK image ONLY to compile the code.
# This image is thrown away after the build - it never ships to production.
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml first and download dependencies.
# Docker caches this layer, so if you only change your Java code (not pom.xml),
# re-builds skip re-downloading every dependency = much faster builds.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy the actual source code and build the jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- Stage 2: Run ----------
# Final image only contains a lightweight JRE (not the full JDK+Maven),
# which makes it dramatically smaller and reduces attack surface.
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create a dedicated non-root user - never run app containers as root
RUN addgroup -S taskflow && adduser -S taskflow -G taskflow

COPY --from=build /app/target/taskflow-backend.jar app.jar

RUN chown -R taskflow:taskflow /app
USER taskflow

EXPOSE 8080

# Tells Docker/Kubernetes how to check if this container is actually healthy,
# not just "running". Uses the Spring Boot Actuator endpoint.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENV SPRING_PROFILES_ACTIVE=docker

ENTRYPOINT ["java", "-jar", "app.jar"]
