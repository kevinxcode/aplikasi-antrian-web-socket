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

echo [1/4] Verifying password...
node "%ROOT_DIR%\app\integrity-check.js" unprotect
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
echo [3/4] Removing deny rules...
for /d %%D in ("%ROOT_DIR%\app\*") do (
    if /i not "%%~nxD"=="node_modules" (
        icacls "%%D" /remove:d Users /T 2>nul
    )
)
for %%F in ("%ROOT_DIR%\app\*.*") do icacls "%%F" /remove:d Users 2>nul
for /d %%D in ("%ROOT_DIR%\*") do (
    if /i not "%%~nxD"=="app" (
        icacls "%%D" /remove:d Users /T 2>nul
    )
)
for %%F in ("%ROOT_DIR%\*.*") do icacls "%%F" /remove:d Users 2>nul

echo.
echo [4/4] Restoring full permissions...
for /d %%D in ("%ROOT_DIR%\app\*") do (
    if /i not "%%~nxD"=="node_modules" (
        icacls "%%D" /grant Users:(OI)(CI)F /T 2>nul
    )
)
for %%F in ("%ROOT_DIR%\app\*.*") do icacls "%%F" /grant Users:F 2>nul

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
