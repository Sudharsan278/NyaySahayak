FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/*.jar groq-service.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "/groq-service.jar"]