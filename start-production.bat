@echo off
echo.
echo ========================================
echo AI Land Verification Platform
echo Production Startup
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js first.
    exit /b 1
)

REM Start Backend
echo Starting Backend API on port 7000...
cd backend
call npm install --silent
echo Launching backend server...
start "Backend API" cmd /k "npm start"

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 3 /nobreak

REM Navigate back
cd ..

REM Show info
echo.
echo ========================================
echo Backend: http://localhost:7000
echo Health:  http://localhost:7000/api/health
echo ========================================
echo.
echo Frontend files are in /dist folder
echo Served by backend at http://localhost:7000
echo.
pause
