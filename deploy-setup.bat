@echo off
echo ========================================
echo   SmartHire Deployment Setup
echo ========================================
echo.

echo Step 1: Initializing Git Repository...
git init
echo.

echo Step 2: Adding all files...
git add .
echo.

echo Step 3: Creating initial commit...
git commit -m "Initial commit - SmartHire deployment ready"
echo.

echo ========================================
echo   Git repository initialized!
echo ========================================
echo.
echo Next Steps:
echo 1. Create a GitHub repository at: https://github.com/new
echo 2. Run these commands:
echo.
echo    git remote add origin YOUR_GITHUB_URL
echo    git push -u origin main
echo.
echo 3. Then deploy on Render.com following DEPLOYMENT_GUIDE.md
echo.
pause