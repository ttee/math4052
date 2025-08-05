#!/bin/bash

# Math4052 Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e  # Exit on error

ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

if [ "$ENVIRONMENT" == "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    ENV_FILE=".env.production"
fi

echo "======================================"
echo "Deploying Math4052 - $ENVIRONMENT"
echo "======================================"

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found!"
    echo "Please create $ENV_FILE with required variables"
    exit 1
fi

# Load environment variables
export $(cat $ENV_FILE | xargs)

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Build containers
echo "Building Docker containers..."
docker-compose -f $COMPOSE_FILE build --no-cache

# Stop existing containers
echo "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

# Start new containers
echo "Starting new containers..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Health check
echo "Performing health checks..."
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✓ Backend is healthy"
else
    echo "✗ Backend health check failed"
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✓ Frontend is healthy"
else
    echo "✗ Frontend health check failed"
fi

# Show running containers
echo ""
echo "Running containers:"
docker-compose -f $COMPOSE_FILE ps

# Clean up old images
echo ""
echo "Cleaning up old Docker images..."
docker image prune -f

echo ""
echo "======================================"
echo "Deployment complete!"
echo "======================================"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "View logs: docker-compose -f $COMPOSE_FILE logs -f"