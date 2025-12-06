# Install libusb untuk Windows

## Cara 1: Download libusb DLL

1. Download libusb dari: https://github.com/libusb/libusb/releases/latest
2. Download file: `libusb-1.0.XX.7z` (versi terbaru)
3. Extract file
4. Copy file `libusb-1.0.dll` dari folder `MS64\dll` ke:
   - `C:\Windows\System32\` (untuk 64-bit)
   - Atau folder aplikasi Anda

## Cara 2: Install Zadig (Recommended untuk Windows)

1. Download Zadig: https://zadig.akeo.ie/
2. Jalankan Zadig.exe
3. Klik **Options** > **List All Devices**
4. Pilih printer ICS Anda dari dropdown
5. Pilih driver: **WinUSB** atau **libusb-win32**
6. Klik **Install Driver** atau **Replace Driver**
7. Tunggu sampai selesai
8. Restart komputer (optional)

## Test setelah install

```bash
python print_thermal.py A001 cs
```

Jika berhasil, output:
```
[OK] ICS Thermal Printer ditemukan!
     VID: 0x0FE6, PID: 0x811E

[*] Mencetak struk...

[OK] Print berhasil!
[*] Cek printer, struk seharusnya keluar
```

## Troubleshooting

Jika masih error "No backend available":
1. Pastikan libusb-1.0.dll ada di System32
2. Atau install Zadig dan replace driver
3. Run Python as Administrator
