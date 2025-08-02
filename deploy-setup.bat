@echo off
echo Setting up Math4052 for deployment...
echo.

echo Step 1: Building frontend for production...
cd math4052-frontend
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo Step 2: Testing backend...
cd math4052-backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend npm install failed!
    pause
    exit /b 1
)
cd ..

echo.
echo ====================================
echo Setup complete!
echo ====================================
echo.
echo Next steps:
echo 1. Push code to GitHub
echo 2. Deploy backend to Render
echo 3. Deploy frontend to Vercel
echo 4. Update environment variables
echo.
echo See DEPLOYMENT.md for detailed instructions
echo.
pause