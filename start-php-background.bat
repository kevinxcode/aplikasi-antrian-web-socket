@echo off
echo Starting PHP Print Server in background...
cd /d %~dp0
start "PHP Print Server" /min cmd /c "cd app && php -S 0.0.0.0:3001"
echo.
echo PHP server started!
echo Running at: http://localhost:3001
echo.
echo To stop: Close the "PHP Print Server" window from Task Manager
timeout /t 3 /nobreak >nul
