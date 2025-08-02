@echo off
echo Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo Node.js processes stopped.
) else (
    echo No Node.js processes were running.
)

timeout /t 2 /nobreak > nul

echo Starting backend server with updated configuration...
cd math4052-backend
start "Math4052 Backend" cmd /k "npm start"

echo.
echo Backend server is restarting...
echo Please wait a few seconds for it to fully start.
echo.
echo Then refresh your browser at http://localhost:5173
pause