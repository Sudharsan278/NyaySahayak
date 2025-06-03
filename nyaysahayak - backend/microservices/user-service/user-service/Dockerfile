FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/*.jar user-service.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/user-service.jar"]