@echo off
echo ========================================
echo   REMOVE FILE PROTECTION
echo ========================================
echo.

cd /d "%~dp0app"

node integrity-check.js unprotect
if errorlevel 1 (
    echo ERROR: Wrong password!
    pause
    exit /b 1
)

echo.
echo [1/2] Removing read-only attributes...
attrib -R index.js
attrib -R db.js
attrib -R print_api.php
attrib -R public\admin.html
attrib -R public\login.html

echo.
echo [2/2] Restoring folder permissions...
icacls . /grant Users:(OI)(CI)F /T

echo.
echo ========================================
echo   PROTECTION REMOVED
echo ========================================
echo You can now modify files
echo.
pause
