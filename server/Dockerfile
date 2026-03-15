FROM python:3.11-slim

WORKDIR /app

# Install dependencies
# Assuming context is the 'server' directory
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY . .

# Environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

# Run server
# Note: Since we are inside /app/ (which is the server content), 
# we run main.py directly
CMD ["python", "main.py"]
