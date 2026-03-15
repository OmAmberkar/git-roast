# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
# Assuming context is the 'client' directory
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Production stage - Serving with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
