@echo off
echo ========================================
echo   BACKUP DATABASE
echo ========================================
echo.

set BACKUP_FILE=backup_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
set BACKUP_FILE=%BACKUP_FILE: =0%

echo Creating backup: %BACKUP_FILE%
echo.

docker exec -t antrian-postgres pg_dump -U antrian -d antrian_db --clean --if-exists --create > %BACKUP_FILE%

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   BACKUP SUCCESS
    echo ========================================
    echo File: %BACKUP_FILE%
    echo.
) else (
    echo.
    echo ========================================
    echo   BACKUP FAILED
    echo ========================================
    echo.
)

pause
