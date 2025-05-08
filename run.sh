#!/bin/bash

# Resume Parser Development Environment Setup
# Created: 2025-05-08 20:20:51 UTC
# Author: ashiduDissanayake

echo "Setting up Resume Parser development environment..."

# Create directories if they don't exist
mkdir -p api_gateway/{app,tests}
mkdir -p api_gateway/app/{core,middleware,routes,services}
mkdir -p mock_services

# Copy files to appropriate locations
echo "Copying files to appropriate locations..."

echo "Building and starting services..."
docker-compose up --build -d

echo "Services are starting. You can access them at:"
echo "- API Gateway: http://localhost:8000/api/docs"
echo "- MongoDB Express: http://localhost:8081"
echo "- Auth Service: http://localhost:8001/docs"
echo "- Upload Service: http://localhost:8002/docs"
echo "- Data Service: http://localhost:8004/docs"
echo "- Jobs Service: http://localhost:8005/docs"
echo "- Search Service: http://localhost:8006/docs"

echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"