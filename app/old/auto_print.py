#!/usr/bin/env python
# -*- coding: utf-8 -*-
from escpos.printer import Usb
from datetime import datetime
import sys

try:
    # Auto-detect USB printer (tidak perlu VID/PID)
    p = Usb(0x0FE6, 0x811E)  # ICS printer
    
    print("Printer terhubung!")
    
    # Print
    p.set(align='center')
    p.set(bold=True, width=2, height=2)
    p.text('BTN Syariah\n')
    
    p.set(bold=False, width=1, height=1)
    p.text('Jl. Sopo Del No 56\n')
    p.text('Jakarta Selatan\n')
    p.text('--------------------------------\n')
    p.text('Nomor Antrian\n\n')
    
    p.set(bold=True, width=2, height=2)
    p.text('A001\n')
    
    p.set(bold=False, width=1, height=1)
    p.text('\nCUSTOMER SERVICE\n\n')
    p.text(datetime.now().strftime("%d/%m/%Y %H:%M") + '\n')
    p.text('--------------------------------\n')
    p.text('TEST PRINT BERHASIL!\n')
    
    p.text('\n\n\n')
    p.cut()
    
    print("Print berhasil!")
    
except Exception as e:
    print(f"Error: {e}")
    print("\nInstall Zadig:")
    print("1. Download: https://zadig.akeo.ie/")
    print("2. Options > List All Devices")
    print("3. Pilih printer ICS")
    print("4. Install WinUSB driver")
    sys.exit(1)
