@echo off
echo ========================================
echo   PHP SERVER FOR PRINT
echo ========================================
echo.
echo Starting PHP server on port 3001...
echo Keep this window open!
echo.

cd /d "%~dp0app"

if exist "C:\xampp\php\php.exe" (
    "C:\xampp\php\php.exe" -S localhost:3001
) else (
    php -S localhost:3001
)

pause
