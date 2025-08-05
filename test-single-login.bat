@echo off
REM Simple login test with existing credentials

set API_URL=http://localhost:5000/api/auth/login

REM Test with a specific user - modify these credentials as needed
set TEST_EMAIL=test@example.com
set TEST_PASSWORD=password123

echo Testing login to Math4052...
echo URL: %API_URL%
echo Email: %TEST_EMAIL%
echo.

curl -X POST %API_URL% ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%TEST_EMAIL%\",\"password\":\"%TEST_PASSWORD%\"}" ^
  -w "\n\nHTTP Status Code: %%{http_code}\n" ^
  -v

echo.
echo If you see "Invalid credentials" error, try:
echo 1. Check if the backend server is running (npm start in math4052-backend)
echo 2. Verify the email/password are correct
echo 3. Check MongoDB is running
echo 4. Try the email in lowercase
echo.
pause