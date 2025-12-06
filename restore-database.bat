@echo off
echo ========================================
echo   RESTORE DATABASE
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

echo Restoring from: %BACKUP_FILE%
echo.
echo WARNING: This will overwrite current database!
pause

echo.
echo Dropping existing database...
docker exec -t antrian-postgres psql -U antrian -d postgres -c "DROP DATABASE IF EXISTS antrian_db;"

echo Creating new database...
docker exec -t antrian-postgres psql -U antrian -d postgres -c "CREATE DATABASE antrian_db;"

echo Restoring data...
docker exec -i antrian-postgres psql -U antrian -d antrian_db < "%BACKUP_FILE%"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   RESTORE SUCCESS
    echo ========================================
    echo.
    echo Restarting application...
    docker restart antrian-app
    echo.
) else (
    echo.
    echo ========================================
    echo   RESTORE FAILED
    echo ========================================
    echo.
)

pause
