FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/*.jar api-gateway.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/api-gateway.jar"]