@echo off
echo =========================================
echo GitHub Authentication Setup
echo =========================================
echo.
echo This will help you set up GitHub authentication.
echo.
echo Choose your authentication method:
echo 1. Personal Access Token (Recommended)
echo 2. SSH Key
echo.
set /p AUTH_METHOD="Enter choice (1 or 2): "

if "%AUTH_METHOD%"=="1" goto TOKEN_AUTH
if "%AUTH_METHOD%"=="2" goto SSH_AUTH
goto END

:TOKEN_AUTH
echo.
echo ===== Personal Access Token Setup =====
echo.
echo Steps to create a Personal Access Token:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Give it a name (e.g., "math4052-push")
echo 4. Select scopes: [x] repo (all)
echo 5. Click "Generate token"
echo 6. COPY THE TOKEN NOW (you won't see it again!)
echo.
set /p TOKEN="Paste your token here: "
echo.

REM Configure git to use token
echo Configuring Git to use token...
git config --global credential.helper manager
echo.

REM Set remote URL with token
echo Setting up repository with token...
git remote set-url origin https://%TOKEN%@github.com/ttee/math4052.git
echo.
echo Token authentication configured!
echo.
echo IMPORTANT: Your token is now saved in Git config.
echo For security, the token won't be visible in future pushes.
goto TEST_PUSH

:SSH_AUTH
echo.
echo ===== SSH Key Setup =====
echo.
echo Checking for existing SSH keys...
if exist "%USERPROFILE%\.ssh\id_rsa.pub" (
    echo Found existing SSH key!
    type "%USERPROFILE%\.ssh\id_rsa.pub"
    echo.
    echo Copy the above key and add it to GitHub:
    echo https://github.com/settings/ssh/new
) else (
    echo No SSH key found. Creating one...
    ssh-keygen -t rsa -b 4096 -C "your-email@example.com" -f "%USERPROFILE%\.ssh\id_rsa" -N ""
    echo.
    echo SSH key created! Here's your public key:
    type "%USERPROFILE%\.ssh\id_rsa.pub"
    echo.
    echo Copy the above key and add it to GitHub:
    echo https://github.com/settings/ssh/new
)
echo.
pause
echo.
echo Updating remote to use SSH...
git remote set-url origin git@github.com:ttee/math4052.git
goto TEST_PUSH

:TEST_PUSH
echo.
echo Testing connection...
git remote -v
echo.
echo Setup complete! You can now use git-push.bat to push your changes.
echo.
pause
goto END

:END