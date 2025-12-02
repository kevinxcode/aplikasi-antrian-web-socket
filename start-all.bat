@echo off
echo Starting Antrian App with Printer Support...
echo.

echo [1/2] Starting PHP Print Server...
start "PHP Print Server" cmd /k "cd app && php -S 0.0.0.0:3001"
timeout /t 2 /nobreak >nul

echo [2/2] Starting Docker Services...
docker-compose up -d --build --force-recreate

echo.
echo ========================================
echo   Antrian App Started!
echo ========================================
echo   App:     http://localhost:3000
echo   PHP API: http://localhost:3001
echo ========================================
echo.
pause
