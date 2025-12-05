@echo off
echo ========================================
echo   FILE PROTECTION SYSTEM
echo ========================================
echo.
echo NOTE: Gunakan CMD untuk password tersembunyi (****)
echo       Di PowerShell, password akan terlihat
echo.

cd /d "%~dp0app"

echo [1/4] Verifying password and generating hashes...
node integrity-check.js init
if errorlevel 1 (
    echo ERROR: Wrong password or failed
    pause
    exit /b 1
)

echo.
echo [2/4] Setting files to read-only...
attrib +R index.js
attrib +R db.js
attrib +R print_api.php
attrib +R public\admin.html
attrib +R public\login.html

echo.
echo [3/4] Restricting app folder permissions...
icacls . /deny Users:(W,M,D) /T

echo.
echo [4/4] Blocking copy/cut operations...
cd ..
icacls . /deny *S-1-1-0:(DE,DC)
icacls . /deny Users:(DE,DC)

echo.
echo ========================================
echo   PROTECTION ACTIVATED
echo ========================================
echo Files protected from:
echo - Modification
echo - Copy
echo - Cut/Move
echo - Delete
echo.
echo To unprotect: Run unprotect-files.bat
echo.
pause
