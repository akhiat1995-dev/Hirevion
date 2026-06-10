@echo off
echo ====================================
echo CV ANALYZER PRO - Backend Demo
echo ====================================
echo.

cd /d "%~dp0BACKEND"

echo Starting server...
start "Backend Server" cmd /k "venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo.
echo Testing endpoints...
echo.

echo [GET] Root endpoint:
curl -s http://localhost:8000/
echo.
echo.

echo [GET] Health check:
curl -s http://localhost:8000/health
echo.
echo.

echo [GET] Stats:
curl -s http://localhost:8000/stats
echo.
echo.

echo ====================================
echo Backend Demo Complete!
echo.
echo Server running at: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
pause
