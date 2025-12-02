@echo off
cd /d "%~dp0app"
echo Starting PHP server on port 3001...
echo PHP will be accessible from Docker at host.docker.internal:3001
php -S 0.0.0.0:3001
