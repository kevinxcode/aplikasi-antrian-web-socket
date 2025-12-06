@echo off
echo ========================================
echo   REMOVE FILE PROTECTION
echo ========================================
echo.
echo NOTE: Password akan tersembunyi (****)
echo.
echo If this fails, run emergency-unprotect.bat as Admin first
echo.

set ROOT_DIR=%~dp0
set ROOT_DIR=%ROOT_DIR:~0,-1%

cd /d "%ROOT_DIR%\app"

echo [1/4] Verifying password...
node integrity-check.js unprotect
if errorlevel 1 (
    echo ERROR: Wrong password!
    pause
    exit /b 1
)

echo.
echo [2/4] Removing read-only attributes...
attrib -R index.js 2>nul
attrib -R db.js 2>nul
attrib -R print_api.php 2>nul
attrib -R public\admin.html 2>nul
attrib -R public\login.html 2>nul

echo.
echo [3/4] Restoring folder permissions...
icacls "%ROOT_DIR%\app" /grant Users:(OI)(CI)F /T 2>nul

echo.
echo [4/4] Allowing copy/delete operations...
icacls "%ROOT_DIR%" /grant Users:(OI)(CI)F /T 2>nul

echo.
echo ========================================
echo   PROTECTION REMOVED
echo ========================================
echo You can now:
echo - Modify files
echo - Copy project
echo - Delete project
echo.
pause
