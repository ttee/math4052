@echo off
echo =========================================
echo Git Push - Without GitHub Actions
echo =========================================
echo.

REM Remove the workflow file from staging
git reset HEAD .github/workflows/deploy.yml

REM Add only Docker-related files (excluding workflows)
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

REM Show what will be committed
echo.
echo Files to be committed:
git status --short
echo.

REM Commit
echo Committing Docker deployment setup...
git commit -m "Add Docker deployment configuration for Math4052 (without workflows)"

REM Push
echo.
echo Pushing to GitHub...
git push origin main

echo.
echo =========================================
echo Docker files pushed successfully!
echo =========================================
echo.
echo NOTE: GitHub Actions workflow was skipped.
echo You can add it manually later if needed.
echo.
pause