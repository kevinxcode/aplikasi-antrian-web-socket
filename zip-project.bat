@echo off
echo ========================================
echo   ZIP PROJECT (Exclude node_modules)
echo ========================================
echo.

set ROOT_DIR=%~dp0
set ROOT_DIR=%ROOT_DIR:~0,-1%
set ZIP_NAME=antrial-app-%date:~-4%%date:~3,2%%date:~0,2%-%time:~0,2%%time:~3,2%.zip
set ZIP_NAME=%ZIP_NAME: =0%

echo Creating: %ZIP_NAME%
echo Excluding: node_modules
echo.

powershell -command "Get-ChildItem -Path '%ROOT_DIR%' -Recurse | Where-Object { $_.FullName -notlike '*\node_modules\*' -and $_.FullName -notlike '*\node_modules' } | Compress-Archive -DestinationPath '%ROOT_DIR%\..\%ZIP_NAME%' -Force -CompressionLevel Optimal"

echo.
echo ========================================
echo   ZIP CREATED
echo ========================================
echo Location: %ROOT_DIR%\..\%ZIP_NAME%
echo.
pause
