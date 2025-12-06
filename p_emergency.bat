@echo off
echo ========================================
echo   EMERGENCY UNPROTECT (Run as Admin)
echo ========================================
echo.
echo This will force remove all protections
echo.
pause

set ROOT_DIR=%~dp0
set ROOT_DIR=%ROOT_DIR:~0,-1%

echo [1/5] Taking ownership...
takeown /f "%ROOT_DIR%" /r /d y

echo.
echo [2/5] Granting full access to Administrators...
icacls "%ROOT_DIR%" /grant Administrators:F /t

echo.
echo [3/5] Granting full access to Users...
icacls "%ROOT_DIR%" /grant Users:(OI)(CI)F /t

echo.
echo [4/5] Removing read-only attributes...
attrib -R "%ROOT_DIR%\app\*.js" /s
attrib -R "%ROOT_DIR%\app\*.php" /s
attrib -R "%ROOT_DIR%\app\public\*.html" /s

echo.
echo [5/5] Removing deny rules...
icacls "%ROOT_DIR%" /remove:d Users /t
icacls "%ROOT_DIR%" /remove:d *S-1-1-0 /t

echo.
echo ========================================
echo   EMERGENCY UNPROTECT COMPLETED
echo ========================================
echo All protections have been removed
echo You can now use unprotect-files.bat normally
echo.
pause
