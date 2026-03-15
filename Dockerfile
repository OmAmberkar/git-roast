# --- STAGE 1: Build the Astro Frontend ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client

# Install frontend dependencies
COPY client/package*.json ./
RUN npm install

# Copy frontend source and build
COPY client/ ./
# This sets the API URL to relative paths for production
RUN npm run build

# --- STAGE 2: Build the FastAPI Backend ---
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY server/ ./server

# Copy the built frontend from Stage 1
# Our main.py expects it at /app/client/dist
COPY --from=frontend-builder /app/client/dist ./client/dist

# Set environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

# Expose the port
EXPOSE 8080

# Run the server
# We use uvicorn directly or via main.py as you have it configured
CMD ["python", "server/main.py"]