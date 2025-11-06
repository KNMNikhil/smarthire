@echo off
echo ========================================
echo SmartHire Installation Script
echo ========================================
echo.

echo Installing root dependencies...
call npm install
echo.

echo Installing server dependencies...
cd server
call npm install
cd ..
echo.

echo Installing client dependencies...
cd client
call npm install
cd ..
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Set up PostgreSQL database
echo 2. Configure environment variables
echo 3. Run: npm run dev
echo.
echo See SETUP.md for detailed instructions
echo ========================================
pause