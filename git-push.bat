@echo off
echo =========================================
echo Git Push to GitHub - Math4052
echo =========================================
echo.

REM Add all changes
echo Adding all changes...
git add .

REM Show status
echo.
echo Current status:
git status --short
echo.

REM Get commit message
set /p COMMIT_MESSAGE="Enter commit message: "

REM Commit changes
echo.
echo Committing changes...
git commit -m "%COMMIT_MESSAGE%"

REM Push to GitHub
echo.
echo Pushing to GitHub...
git push origin main

echo.
echo =========================================
echo Push complete!
echo =========================================
echo.
echo Repository: https://github.com/ttee/math4052
echo.
pause