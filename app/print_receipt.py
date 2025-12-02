#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import json
import os
import subprocess
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

# Save to temp file
temp_file = os.path.join(os.path.dirname(__file__), 'temp_print.prn')
with open(temp_file, 'wb') as f:
    f.write(data)

# Try win32print first
try:
    import win32print
    
    # Find thermal printer
    printers = [p[2] for p in win32print.EnumPrinters(2)]
    thermal = next((p for p in printers if any(x in p.lower() for x in ['pos', 'thermal', 'ics', 'rongta', 'epson', 'xprinter', 'zjiang'])), None)
    
    if not thermal:
        thermal = win32print.GetDefaultPrinter()
    
    # Print
    hPrinter = win32print.OpenPrinter(thermal)
    hJob = win32print.StartDocPrinter(hPrinter, 1, ("Receipt", None, "RAW"))
    win32print.StartPagePrinter(hPrinter)
    win32print.WritePrinter(hPrinter, data)
    win32print.EndPagePrinter(hPrinter)
    win32print.EndDocPrinter(hPrinter)
    win32print.ClosePrinter(hPrinter)
    
    os.remove(temp_file)
    print(f"Print OK: {thermal}")
    sys.exit(0)
    
except ImportError:
    # Fallback: use Windows copy command
    try:
        result = subprocess.run(['wmic', 'printer', 'get', 'name'], capture_output=True, text=True)
        printers = [line.strip() for line in result.stdout.split('\n') if line.strip() and line.strip() != 'Name']
        
        thermal = next((p for p in printers if any(x in p.lower() for x in ['pos', 'thermal', 'ics', 'rongta', 'epson', 'xprinter', 'zjiang'])), None)
        
        if thermal:
            subprocess.run(['copy', '/b', temp_file, f'\\\\localhost\\{thermal}'], shell=True, check=True)
            os.remove(temp_file)
            print(f"Print OK: {thermal}")
            sys.exit(0)
        else:
            print("No thermal printer found")
            sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
