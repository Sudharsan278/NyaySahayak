FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/*.jar favorite-service.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "/favorite-service.jar"]