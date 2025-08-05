# Math4052 Docker Deployment Guide

This guide explains how to deploy the Math4052 quiz application using Docker, which solves many common deployment issues.

## Prerequisites

- Docker and Docker Compose installed
- Git repository cloned

## Quick Start (Development)

1. **Copy environment file:**
   ```bash
   cp .env.docker .env
   ```

2. **Update `.env` with your values:**
   - Generate a secure JWT_SECRET
   - Add Stripe key if using payments
   - Update URLs for your domain

3. **Build and start services:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Production Deployment

### 1. Environment Setup

Create `.env.production` with:
```env
# MongoDB Credentials
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure_password_here

# JWT Secret (generate a secure one)
JWT_SECRET=your_very_secure_jwt_secret

# URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# Stripe (if using)
STRIPE_SECRET_KEY=your_stripe_key
```

### 2. SSL Certificates

For HTTPS, place SSL certificates in `nginx/ssl/`:
- `nginx/ssl/cert.pem`
- `nginx/ssl/key.pem`

### 3. Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Docker Commands

### View logs:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Restart services:
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Stop all services:
```bash
docker-compose down
```

### Remove all data (WARNING):
```bash
docker-compose down -v
```

## Benefits of Docker Deployment

1. **Consistent Environment**: Same setup across development, staging, and production
2. **Easy Scaling**: Add more containers as needed
3. **Isolation**: Services run in separate containers
4. **Simple Updates**: Just rebuild and restart containers
5. **Database Management**: MongoDB included with persistent volumes

## Troubleshooting

### Backend can't connect to MongoDB:
- Check MongoDB is running: `docker-compose ps`
- Verify connection string in environment variables
- Check logs: `docker-compose logs mongodb`

### CORS errors:
- Verify FRONTEND_URL in backend environment
- Check nginx configuration for proper headers

### Frontend can't reach backend:
- Verify VITE_API_URL is correct
- Check backend is running: `docker-compose ps backend`
- Test backend directly: `curl http://localhost:5000/api/auth/login`

### Port conflicts:
- Change ports in docker-compose.yml if needed:
  ```yaml
  ports:
    - "8080:80"  # Change 8080 to available port
  ```

## Monitoring

View container status:
```bash
docker-compose ps
```

Check resource usage:
```bash
docker stats
```

## Backup

Backup MongoDB data:
```bash
docker-compose exec mongodb mongodump --out /backup
docker cp math4052-mongodb:/backup ./mongodb-backup
```

Restore MongoDB data:
```bash
docker cp ./mongodb-backup math4052-mongodb:/backup
docker-compose exec mongodb mongorestore /backup
```

## Updates

1. Pull latest code:
   ```bash
   git pull
   ```

2. Rebuild containers:
   ```bash
   docker-compose build --no-cache
   ```

3. Restart services:
   ```bash
   docker-compose up -d
   ```

## Security Notes

- Always use strong passwords for MongoDB
- Generate secure JWT secrets
- Use HTTPS in production
- Keep Docker images updated
- Don't commit `.env` files to git