@echo off
echo Starting Math4052 servers...

echo Starting backend server...
start "Math4052 Backend" cmd /k "cd math4052-backend && npm start"

timeout /t 3 /nobreak > nul

echo Starting frontend server...
start "Math4052 Frontend" cmd /k "cd math4052-frontend && npm run dev"

echo.
echo Servers starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Close this window when done.