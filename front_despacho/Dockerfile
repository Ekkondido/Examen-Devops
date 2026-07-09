# --- Stage 1: Construcción (Build) ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Imagen final para producción (Nginx) ---
FROM nginx:alpine AS production

# 1. COPIAMOS TU CONFIGURACIÓN PERSONALIZADA CON LOS PROXIES 🚀
# Al copiarlo encima de default.conf, matamos la config genérica y aplicamos tus rutas al tiro.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 2. Copiamos los archivos estáticos de React
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto alto seguro que configuramos en tu nginx.conf
EXPOSE 8080

# Ajustamos permisos para que el usuario limitado pueda usar las carpetas de Nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Cambiamos explícitamente al usuario sin privilegios antes de ejecutar
USER nginx

CMD ["nginx", "-g", "daemon off;"]
