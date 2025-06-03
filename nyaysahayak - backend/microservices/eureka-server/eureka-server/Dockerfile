FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/*.jar eureka-server.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "/eureka-server.jar"]