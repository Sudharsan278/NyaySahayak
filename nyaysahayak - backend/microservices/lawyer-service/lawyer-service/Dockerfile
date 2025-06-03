FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/*.jar lawyer-service.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/lawyer-service.jar"]