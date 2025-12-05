@echo off
echo ========================================
echo   FILE PROTECTION SYSTEM
echo ========================================
echo.

cd /d "%~dp0app"

echo [1/3] Generating file hashes...
node integrity-check.js init
if errorlevel 1 (
    echo ERROR: Wrong password or failed
    pause
    exit /b 1
)

echo.
echo [2/3] Setting files to read-only...
attrib +R index.js
attrib +R db.js
attrib +R print_api.php
attrib +R public\admin.html
attrib +R public\login.html

echo.
echo [3/3] Restricting folder permissions...
icacls . /deny Users:(W,M,D) /T

echo.
echo ========================================
echo   PROTECTION ACTIVATED
echo ========================================
echo Files are now protected from modification
echo.
pause
