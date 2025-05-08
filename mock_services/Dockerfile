FROM python:3.9-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install dependencies
RUN pip install --no-cache-dir fastapi uvicorn pyjwt python-multipart

# Copy application code
COPY . .

# Expose the port the app will run on
EXPOSE 8000

# Command to run the application
CMD ["python", "main.py"]