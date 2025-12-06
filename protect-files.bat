@echo off
echo ========================================
echo   FILE PROTECTION SYSTEM
echo ========================================
echo.
echo NOTE: Password akan tersembunyi (****)
echo.
echo IMPORTANT: Run as Administrator for full protection
echo.

set ROOT_DIR=%~dp0
set ROOT_DIR=%ROOT_DIR:~0,-1%

cd /d "%ROOT_DIR%\app"

echo [1/4] Verifying password and generating hashes...
node integrity-check.js init
if errorlevel 1 (
    echo ERROR: Wrong password or failed
    pause
    exit /b 1
)

echo.
echo [2/4] Setting files to read-only...
attrib +R index.js 2>nul
attrib +R db.js 2>nul
attrib +R print_api.php 2>nul
attrib +R public\admin.html 2>nul
attrib +R public\login.html 2>nul

echo.
echo [3/4] Restricting folder write access...
icacls "%ROOT_DIR%\app" /deny Users:(W,M) 2>nul

echo.
echo [4/4] Blocking copy/delete operations...
icacls "%ROOT_DIR%" /deny Users:(DE,DC) 2>nul

echo.
echo ========================================
echo   PROTECTION ACTIVATED
echo ========================================
echo Protected:
echo - Files are read-only
echo - Cannot modify files
echo - Cannot copy folder
echo - Cannot delete folder
echo.
echo To unprotect: Run emergency-unprotect.bat as Admin
echo Then run: unprotect-files.bat
echo.
pause
