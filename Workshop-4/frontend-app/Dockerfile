# === Build Stage ===
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source and generate production build
COPY . .
RUN npm run build

# === Production Stage ===
FROM nginx:alpine

# Copy Vite build output to Nginx HTML root
COPY --from=build /app/dist /usr/share/nginx/html

# Apply custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose service port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
