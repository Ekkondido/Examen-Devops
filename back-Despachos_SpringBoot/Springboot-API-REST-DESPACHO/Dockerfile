FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
#copia el pom
COPY pom.xml ./
#dependencias
RUN mvn dependency:go-offline 
#copia el codigo
COPY src ./src  
#es para hacer el compilado, basicamente un exe
RUN mvn clean package -DskipTests

#stage 2
#version de java en la cual vamos crear la imagen
FROM eclipse-temurin:17-jre-alpine AS production
#copia el jar del stage 1 al stage 2
COPY --from=build /app/target/*.jar app.jar
#PUERTO DONDE SE UBICA, no es el mismo del front pero esto lo veremos en DOCKER-COMPOSE
EXPOSE 8080 

# Restringir privilegios del contenedor a usuario no-root
USER guest

ENTRYPOINT [ "java", "-jar", "app.jar" ]
