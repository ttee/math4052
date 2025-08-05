@echo off
setlocal EnableDelayedExpansion

REM Configuration
set API_URL=http://localhost:5000/api
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=!TIMESTAMP: =0!
set TEST_EMAIL=test%TIMESTAMP%@example.com
set TEST_PASSWORD=testPassword123
set ADMIN_EMAIL=admin%TIMESTAMP%@example.com
set ADMIN_PASSWORD=adminPassword123

echo =========================================
echo Math4052 API Authentication Testing
echo =========================================
echo.

REM Test 1: Register a new user
echo Test 1: Register a new user
echo Email: %TEST_EMAIL%
curl -s -X POST "%API_URL%/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"%TEST_EMAIL%\",\"password\":\"%TEST_PASSWORD%\"}" -w "\nStatus: %%{http_code}\n"
echo.

REM Test 2: Try to register the same user again (should fail)
echo Test 2: Register duplicate user (should fail)
curl -s -X POST "%API_URL%/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"%TEST_EMAIL%\",\"password\":\"%TEST_PASSWORD%\"}" -w "\nStatus: %%{http_code}\n"
echo.

REM Test 3: Login with correct credentials
echo Test 3: Login with correct credentials
curl -s -X POST "%API_URL%/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"%TEST_EMAIL%\",\"password\":\"%TEST_PASSWORD%\"}" -w "\nStatus: %%{http_code}\n"
echo.

REM Test 4: Login with incorrect password
echo Test 4: Login with incorrect password
curl -s -X POST "%API_URL%/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"%TEST_EMAIL%\",\"password\":\"wrongPassword\"}" -w "\nStatus: %%{http_code}\n"
echo.

REM Test 5: Login with non-existent email
echo Test 5: Login with non-existent email
curl -s -X POST "%API_URL%/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"nonexistent@example.com\",\"password\":\"%TEST_PASSWORD%\"}" -w "\nStatus: %%{http_code}\n"
echo.

REM Test 6: Register an admin user
echo Test 6: Register an admin user
echo Email: %ADMIN_EMAIL%
curl -s -X POST "%API_URL%/auth/register" -H "Content-Type: application/json" -d "{\"email\":\"%ADMIN_EMAIL%\",\"password\":\"%ADMIN_PASSWORD%\",\"role\":\"admin\"}" -w "\nStatus: %%{http_code}\n"
echo.

REM Test 7: Login as admin and check role
echo Test 7: Login as admin and verify role
curl -s -X POST "%API_URL%/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"%ADMIN_EMAIL%\",\"password\":\"%ADMIN_PASSWORD%\"}" -w "\nStatus: %%{http_code}\n"
echo.

REM Test 8: Forgot password
echo Test 8: Request password reset
curl -s -X POST "%API_URL%/auth/forgot-password" -H "Content-Type: application/json" -d "{\"email\":\"%TEST_EMAIL%\"}" -w "\nStatus: %%{http_code}\n"
echo.

echo =========================================
echo Testing completed!
echo =========================================
echo.
echo Note: Check the responses above for:
echo - Status 201 for successful registration
echo - Status 200 for successful login
echo - Status 400/401 for expected failures
echo.
pause