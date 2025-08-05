@echo off
echo =========================================
echo Git Push - Docker Deployment Files
echo =========================================
echo.

REM Add only Docker-related files
echo Adding Docker deployment files...
git add docker-compose.yml
git add docker-compose.prod.yml
git add math4052-backend/Dockerfile
git add math4052-backend/.dockerignore
git add math4052-frontend/Dockerfile
git add math4052-frontend/.dockerignore
git add math4052-frontend/nginx.conf
git add nginx/nginx.prod.conf
git add .env.docker
git add DOCKER-DEPLOYMENT.md
git add DEPLOY-TO-INTERNET.md
git add scripts/deploy.sh
git add scripts/setup-server.sh
git add .github/workflows/deploy.yml

REM Show what will be committed
echo.
echo Files to be committed:
git status --short
echo.

REM Commit
echo Committing Docker deployment setup...
git commit -m "Add Docker deployment configuration for Math4052"

REM Push
echo.
echo Pushing to GitHub...
git push origin main

echo.
echo =========================================
echo Docker deployment files pushed!
echo =========================================
echo.
echo Next steps:
echo 1. Set up your server (DigitalOcean, AWS, etc.)
echo 2. Clone the repo on your server
echo 3. Run: ./scripts/setup-server.sh
echo 4. Deploy: ./scripts/deploy.sh production
echo.
pause