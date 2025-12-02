@echo off
echo Uninstalling PHP Print Server...
echo.

schtasks /delete /tn "PHP Print Server" /f

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS! PHP Print Server removed from startup.
) else (
    echo.
    echo FAILED! Task may not exist or run as Administrator.
)

echo.
pause
