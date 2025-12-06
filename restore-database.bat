@echo off
echo ========================================
echo   DROP AND RESTORE DATABASE
echo ========================================
echo.

if "%~1"=="" (
    echo Usage: restore-database.bat [backup_file.sql]
    echo.
    echo Available backup files:
    dir /b *.sql 2>nul
    echo.
    pause
    exit /b 1
)

set BACKUP_FILE=%~1

if not exist "%BACKUP_FILE%" (
    echo ERROR: File not found: %BACKUP_FILE%
    echo.
    pause
    exit /b 1
)

echo File: %BACKUP_FILE%
echo.
echo WARNING: This will DROP and RESTORE database!
echo All current data will be lost!
echo.
pause

echo.
echo [1/3] Stopping application...
docker stop antrian-app

echo [2/3] Restoring database (drop + create + data)...
docker exec -i antrian-postgres psql -U antrian -d postgres < "%BACKUP_FILE%"

echo [3/3] Starting application...
docker start antrian-app

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   RESTORE SUCCESS
    echo ========================================
) else (
    echo.
    echo ========================================
    echo   RESTORE FAILED
    echo ========================================
)

echo.
pause
