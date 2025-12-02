#!/usr/bin/env python
# -*- coding: utf-8 -*-
import win32print
import sys
import json
import os
from datetime import datetime

# Get parameters
queue_number = sys.argv[1] if len(sys.argv) > 1 else 'A001'
queue_type = sys.argv[2] if len(sys.argv) > 2 else 'cs'

# Load settings
settings_file = os.path.join(os.path.dirname(__file__), 'temp_settings.json')
if os.path.exists(settings_file):
    with open(settings_file, 'r', encoding='utf-8') as f:
        settings = json.load(f)
else:
    settings = {
        'title': 'BTN Syariah',
        'address': 'Jl. Sopo Del No 56 Jakarta Selatan',
        'footer': 'Terima kasih'
    }

service_type = 'CUSTOMER SERVICE' if queue_type == 'cs' else 'TELLER SERVICE'
date_str = datetime.now().strftime('%d/%m/%Y %H:%M')

# ESC/POS commands
data = b'\x1B\x40'  # Init
data += b'\x1B\x61\x01'  # Center
data += b'\x1B\x21\x30\x1B\x45\x01' + settings['title'].encode('utf-8') + b'\n'
data += b'\x1B\x45\x00\x1B\x21\x00'
data += settings['address'].encode('utf-8') + b'\n'
data += b'--------------------------------\n'
data += b'Nomor Antrian\n\n'
data += b'\x1B\x21\x30\x1B\x45\x01' + queue_number.encode('utf-8') + b'\n'
data += b'\x1B\x45\x00\x1B\x21\x00\n' + service_type.encode('utf-8') + b'\n\n'
data += date_str.encode('utf-8') + b'\n'
data += b'--------------------------------\n'
if settings.get('footer'):
    data += settings['footer'].encode('utf-8') + b'\n'
data += b'\n\n\n'
data += b'\x1D\x56\x00'  # Cut

# Get default printer
printer_name = win32print.GetDefaultPrinter()
print(f"Default printer: {printer_name}")

# Or find thermal printer
printers = [p[2] for p in win32print.EnumPrinters(2)]
thermal = next((p for p in printers if any(x in p.lower() for x in ['pos', 'thermal', 'ics', 'rongta', 'epson'])), None)

if thermal:
    printer_name = thermal
    print(f"Thermal printer: {printer_name}")

# Print
try:
    hPrinter = win32print.OpenPrinter(printer_name)
    hJob = win32print.StartDocPrinter(hPrinter, 1, ("Receipt", None, "RAW"))
    win32print.StartPagePrinter(hPrinter)
    win32print.WritePrinter(hPrinter, data)
    win32print.EndPagePrinter(hPrinter)
    win32print.EndDocPrinter(hPrinter)
    win32print.ClosePrinter(hPrinter)
    print("Print berhasil!")
except Exception as e:
    print(f"Error: {e}")
    print("\nPastikan printer sudah terinstall di Windows:")
    print("Control Panel > Devices and Printers")
