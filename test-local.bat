@echo off
echo Starting Math4052 Quiz Application Local Test...
echo.

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo.
echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo.
echo Checking MongoDB connection...
echo Please ensure MongoDB is running locally or you have a cloud MongoDB URI configured.
echo.

echo Installing backend dependencies...
cd math4052-backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies.
    pause
    exit /b 1
)

echo.
echo Starting backend server...
start cmd /k "cd /d %cd% && npm start"

echo.
echo Installing frontend dependencies...
cd ..\math4052-frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies.
    pause
    exit /b 1
)

echo.
echo Starting frontend development server...
start cmd /k "cd /d %cd% && npm run dev"

echo.
echo ====================================
echo Local deployment started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ====================================
echo.
echo Press any key to exit...
pause >nul