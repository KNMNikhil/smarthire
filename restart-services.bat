@echo off
echo Stopping existing services...
taskkill /f /im node.exe 2>nul

echo Starting backend server on port 5000...
cd server
start "Backend Server" cmd /k "node index.js"

echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo Starting frontend client on port 3002...
cd ..\client
start "Frontend Client" cmd /k "npm start"

echo Services started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3002
pause