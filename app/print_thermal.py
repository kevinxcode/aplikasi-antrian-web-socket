#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Thermal Printer - ESC/POS Print via USB
"""

import usb.core
import usb.util
import sys
from datetime import datetime

# ESC/POS Commands
ESC = b'\x1B'
GS = b'\x1D'
INIT = ESC + b'\x40'
CENTER = ESC + b'\x61\x01'
LEFT = ESC + b'\x61\x00'
BOLD_ON = ESC + b'\x45\x01'
BOLD_OFF = ESC + b'\x45\x00'
TEXT_DOUBLE = b'\x1B\x21\x30'
TEXT_NORMAL = b'\x1B\x21\x00'
CUT = GS + b'\x56\x00'

def find_printer():
    """Find thermal printer USB device"""
    # ICS Printer
    dev = usb.core.find(idVendor=0x0FE6, idProduct=0x811E)
    if dev:
        return dev, "ICS Thermal Printer"
    
    # Rongta
    dev = usb.core.find(idVendor=0x1FC9)
    if dev:
        return dev, "Rongta Thermal Printer"
    
    # Epson
    dev = usb.core.find(idVendor=0x04B8)
    if dev:
        return dev, "Epson Thermal Printer"
    
    # Generic - find any printer
    dev = usb.core.find(find_all=False, bDeviceClass=7)  # Printer class
    if dev:
        return dev, "Generic Thermal Printer"
    
    return None, None

def print_receipt(queue_number, queue_type, settings):
    """Print receipt to thermal printer"""
    
    print("Thermal Printer - Python\n")
    
    # Find printer
    dev, printer_name = find_printer()
    
    if dev is None:
        print("[X] Printer tidak ditemukan")
        print("\nTroubleshooting:")
        print("1. Pastikan printer terhubung ke USB")
        print("2. Pastikan printer menyala")
        print("3. Install driver libusb: pip install pyusb")
        return False
    
    print(f"[OK] {printer_name} ditemukan!")
    print(f"     VID: 0x{dev.idVendor:04X}, PID: 0x{dev.idProduct:04X}\n")
    
    try:
        # Detach kernel driver if active
        if dev.is_kernel_driver_active(0):
            dev.detach_kernel_driver(0)
        
        # Set configuration
        dev.set_configuration()
        
        # Get endpoint
        cfg = dev.get_active_configuration()
        intf = cfg[(0,0)]
        ep = usb.util.find_descriptor(
            intf,
            custom_match=lambda e: usb.util.endpoint_direction(e.bEndpointAddress) == usb.util.ENDPOINT_OUT
        )
        
        if ep is None:
            print("[X] Endpoint tidak ditemukan")
            return False
        
        print("[*] Mencetak struk...\n")
        
        # Build print data
        service_type = "CUSTOMER SERVICE" if queue_type == "cs" else "TELLER SERVICE"
        date_str = datetime.now().strftime("%A, %d %B %Y %H:%M")
        
        data = b''
        data += INIT
        data += CENTER
        data += TEXT_DOUBLE + BOLD_ON
        data += settings['title'].encode('utf-8') + b'\n'
        data += BOLD_OFF + TEXT_NORMAL
        data += settings['address'].encode('utf-8') + b'\n'
        data += b'--------------------------------\n'
        data += b'Nomor Antrian\n\n'
        data += TEXT_DOUBLE + BOLD_ON
        data += queue_number.encode('utf-8') + b'\n'
        data += BOLD_OFF + TEXT_NORMAL
        data += b'\n' + service_type.encode('utf-8') + b'\n\n'
        data += date_str.encode('utf-8') + b'\n'
        data += b'--------------------------------\n'
        if settings.get('footer'):
            data += settings['footer'].encode('utf-8') + b'\n'
        data += b'\n\n\n'
        data += CUT
        
        # Send to printer in chunks
        chunk_size = 64
        for i in range(0, len(data), chunk_size):
            chunk = data[i:i+chunk_size]
            ep.write(chunk)
        
        print("[OK] Print berhasil!")
        print("[*] Cek printer, struk seharusnya keluar\n")
        return True
        
    except usb.core.USBError as e:
        print(f"[X] USB Error: {e}")
        print("\nCoba:")
        print("1. Run as Administrator")
        print("2. Install Zadig (WinUSB driver)")
        print("3. Restart printer\n")
        return False
    except Exception as e:
        print(f"[X] Error: {e}\n")
        return False

if __name__ == "__main__":
    import json
    import os
    
    # Load settings from file or use default
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
    
    if len(sys.argv) > 1:
        queue_number = sys.argv[1]
        queue_type = sys.argv[2] if len(sys.argv) > 2 else 'cs'
    else:
        queue_number = 'A001'
        queue_type = 'cs'
    
    success = print_receipt(queue_number, queue_type, settings)
    sys.exit(0 if success else 1)
