@echo off
echo ========================================
echo   REMOVE FILE PROTECTION
echo ========================================
echo.
echo NOTE: Gunakan CMD untuk password tersembunyi (****)
echo       Di PowerShell, password akan terlihat
echo.

echo [1/4] Restoring root folder permissions...
icacls "%~dp0" /grant Users:(OI)(CI)F /T
icacls "%~dp0" /grant *S-1-1-0:(OI)(CI)F

echo.
echo [2/4] Restoring app folder permissions...
icacls "%~dp0app" /grant Users:(OI)(CI)F /T

cd /d "%~dp0app"

echo.
echo [3/4] Verifying password...
node integrity-check.js unprotect
if errorlevel 1 (
    echo ERROR: Wrong password!
    pause
    exit /b 1
)

echo.
echo [4/4] Removing read-only attributes...
attrib -R index.js
attrib -R db.js
attrib -R print_api.php
attrib -R public\admin.html
attrib -R public\login.html

echo.
echo ========================================
echo   PROTECTION REMOVED
echo ========================================
echo You can now:
echo - Modify files
echo - Copy project
echo - Move project
echo.
pause
