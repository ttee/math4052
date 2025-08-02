@echo off
echo Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo Node.js processes stopped.
) else (
    echo No Node.js processes were running.
)

timeout /t 2 /nobreak > nul

echo.
echo Starting fresh backend and frontend servers...
echo.

cd math4052-backend
echo Starting backend server on port 5000...
start "Math4052 Backend" cmd /k "npm start"

timeout /t 3 /nobreak > nul

cd ..\math4052-frontend
echo Starting frontend server on port 5173...
start "Math4052 Frontend" cmd /k "npm run dev"

echo.
echo ====================================
echo Servers are starting fresh!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ====================================
echo.
echo Login credentials:
echo Email: abc@gmail.comm
echo Password: admin123
echo.
pause