@echo off
echo Installing PHP Print Server as Windows Startup Task...
echo.

set SCRIPT_PATH=%~dp0start-php.bat

echo Script path: %SCRIPT_PATH%
echo.

schtasks /create /tn "PHP Print Server" /tr "\"%SCRIPT_PATH%\"" /sc onlogon /rl highest /f

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo PHP Print Server installed successfully.
    echo It will start automatically on Windows login.
    echo.
    echo Starting PHP server now...
    cd /d %~dp0
    start "PHP Print Server" /min cmd /c "cd app && php -S 0.0.0.0:3001"
    timeout /t 2 /nobreak >nul
    echo.
    echo PHP server is now running in background!
    echo To remove: uninstall-php-service.bat
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   FAILED!
    echo ========================================
    echo Please run this file as Administrator.
    echo Right-click and select "Run as administrator"
    echo ========================================
)

echo.
pause
