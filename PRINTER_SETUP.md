# Setup Printer dengan Python

## Versi Python
**Python 3.8 - 3.12** (Recommended: Python 3.10+)

## Library yang Diperlukan

### 1. **python-escpos** (Recommended untuk Thermal Printer)
```bash
pip install python-escpos
```
- Support thermal printer (POS printer)
- Support USB, Serial, Network printer
- Mudah digunakan untuk receipt printing

### 2. **pywin32** (Windows Printer)
```bash
pip install pywin32
```
- Akses Windows printer API
- Support semua printer yang terinstall di Windows

### 3. **cups** (Linux/Mac)
```bash
pip install pycups
```
- Untuk sistem Linux/Mac
- Interface ke CUPS printing system

### 4. **pyusb** (USB Printer)
```bash
pip install pyusb
```
- Komunikasi langsung via USB
- Diperlukan untuk beberapa thermal printer

## Contoh Penggunaan

### Thermal Printer (ESC/POS)
```python
from escpos.printer import Usb

# Setup printer (vendor_id, product_id)
p = Usb(0x04b8, 0x0e15)

# Print text
p.text("Hello World\n")
p.cut()
```

### Windows Printer (Localhost)
```python
import win32print

# Gunakan printer default
printer_name = win32print.GetDefaultPrinter()

# Atau pilih printer spesifik
printers = [printer[2] for printer in win32print.EnumPrinters(2)]
print(printers)  # List semua printer

# Print text sederhana
win32print.SetDefaultPrinter(printer_name)
import os
os.startfile("file.pdf", "print")
```

### Print dengan pywin32
```python
import win32print
import win32ui

printer_name = win32print.GetDefaultPrinter()
hdc = win32ui.CreateDC()
hdc.CreatePrinterDC(printer_name)
hdc.StartDoc("Document")
hdc.StartPage()
hdc.TextOut(100, 100, "Hello World")
hdc.EndPage()
hdc.EndDoc()
```

## Instalasi Driver

1. **Windows**: Install driver printer dari manufacturer
2. **Linux**: Install CUPS
   ```bash
   sudo apt-get install cups
   ```
3. **USB Thermal Printer**: Install libusb
   ```bash
   # Windows: Download dari libusb.info
   # Linux:
   sudo apt-get install libusb-1.0-0
   ```

## Troubleshooting

- **Permission denied**: Jalankan sebagai administrator (Windows) atau gunakan sudo (Linux)
- **Printer not found**: Cek vendor_id dan product_id dengan `lsusb` (Linux) atau Device Manager (Windows)
- **Module not found**: Pastikan semua dependencies terinstall

## Requirements.txt
```
python-escpos>=3.0
pywin32>=305
pyusb>=1.2.1
Pillow>=10.0.0
```
