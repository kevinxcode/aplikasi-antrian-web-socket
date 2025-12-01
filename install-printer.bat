@echo off
echo ========================================
echo  Install Printer Thermal Dependencies
echo ========================================
echo.

cd app

echo [1/3] Installing dependencies...
call npm install escpos@3.0.0-alpha.6 escpos-usb@3.0.0-alpha.4

echo.
echo [2/3] Testing printer detection...
node -e "const usb = require('escpos-usb'); const devices = usb.USB.findPrinter(); console.log('Found', devices.length, 'printer(s)');"

echo.
echo [3/3] Running test print...
echo.
echo Pastikan printer thermal sudah dicolok dan menyala!
echo Tekan ENTER untuk test print, atau CTRL+C untuk batal...
pause > nul

node test-printer.js

echo.
echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Jalankan aplikasi: npm start
echo 2. Login sebagai admin
echo 3. Buka menu "Pengaturan Printer"
echo 4. Konfigurasi struk sesuai kebutuhan
echo.
pause
