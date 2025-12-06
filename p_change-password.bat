@echo off
echo ========================================
echo   CHANGE PROTECTION PASSWORD
echo ========================================
echo.

cd /d "%~dp0app"

node change-password.js

echo.
pause
