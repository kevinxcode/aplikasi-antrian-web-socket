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
for /d %%D in ("%ROOT_DIR%\app\*") do (
    if /i not "%%~nxD"=="node_modules" (
        icacls "%%D" /deny Users:(W,M) /T 2>nul
    )
)
for %%F in ("%ROOT_DIR%\app\*.*") do icacls "%%F" /deny Users:(W,M) 2>nul

echo.
echo [4/4] Blocking copy/delete operations...
for /d %%D in ("%ROOT_DIR%\*") do (
    if /i not "%%~nxD"=="app" (
        icacls "%%D" /deny Users:(DE,DC) /T 2>nul
    )
)
for %%F in ("%ROOT_DIR%\*.*") do icacls "%%F" /deny Users:(DE,DC) 2>nul

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
