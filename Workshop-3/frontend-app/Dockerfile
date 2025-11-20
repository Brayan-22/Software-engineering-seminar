# --- Build stage ---
FROM node:18-alpine AS build

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente y construir
COPY . .
RUN npm run build


# --- Production stage ---
FROM nginx:alpine

# Copiar el build de Vite al root de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
