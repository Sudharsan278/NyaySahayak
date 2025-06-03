FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/*.jar act-service.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "/act-service.jar"]