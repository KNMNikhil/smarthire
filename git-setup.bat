@echo off
echo ========================================
echo SmartHire - Git Setup Script
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please download and install Git from: https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)

echo Git is installed. Proceeding with setup...
echo.

REM Initialize Git repository
echo [1/5] Initializing Git repository...
git init
if errorlevel 1 (
    echo ERROR: Failed to initialize Git repository
    pause
    exit /b 1
)
echo ✓ Git repository initialized
echo.

REM Add all files
echo [2/5] Adding all files to Git...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo ✓ Files added
echo.

REM Commit files
echo [3/5] Creating initial commit...
git commit -m "Initial commit - SmartHire Placement Portal ready for deployment"
if errorlevel 1 (
    echo ERROR: Failed to commit files
    pause
    exit /b 1
)
echo ✓ Initial commit created
echo.

REM Prompt for GitHub repository URL
echo [4/5] GitHub Repository Setup
echo.
echo Please create a new repository on GitHub:
echo 1. Go to https://github.com/new
echo 2. Repository name: smarthire-placement-portal
echo 3. Make it PUBLIC
echo 4. Do NOT initialize with README
echo 5. Click "Create repository"
echo.
set /p GITHUB_URL="Enter your GitHub repository URL (e.g., https://github.com/username/smarthire-placement-portal.git): "

if "%GITHUB_URL%"=="" (
    echo ERROR: GitHub URL cannot be empty
    pause
    exit /b 1
)

REM Add remote origin
echo.
echo [5/5] Adding remote origin and pushing to GitHub...
git remote add origin %GITHUB_URL%
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Failed to push to GitHub
    echo.
    echo Possible reasons:
    echo - Invalid repository URL
    echo - Repository already has content
    echo - Authentication failed
    echo.
    echo To fix authentication issues:
    echo 1. Use GitHub Desktop (recommended)
    echo 2. Or configure Git credentials:
    echo    git config --global user.name "Your Name"
    echo    git config --global user.email "your.email@example.com"
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo Your repository: %GITHUB_URL%
echo.
echo NEXT STEPS:
echo 1. Go to https://render.com and sign up
echo 2. Follow the QUICK_DEPLOY.md guide
echo 3. Deploy your backend and frontend
echo.
echo Good luck with your deployment! 🚀
echo.
pause
