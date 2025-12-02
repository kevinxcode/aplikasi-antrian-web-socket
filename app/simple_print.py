#!/usr/bin/env python
# -*- coding: utf-8 -*-
import usb.core
import usb.util
from datetime import datetime

# Find printer (ICS: 0x0FE6)
dev = usb.core.find(idVendor=0x0FE6, idProduct=0x811E)

if dev is None:
    print("Printer tidak ditemukan!")
    exit(1)

print(f"Printer ditemukan: VID=0x{dev.idVendor:04X}, PID=0x{dev.idProduct:04X}")

# Detach kernel driver
if dev.is_kernel_driver_active(0):
    dev.detach_kernel_driver(0)

# Set config
dev.set_configuration()

# Get endpoint
cfg = dev.get_active_configuration()
intf = cfg[(0,0)]
ep = usb.util.find_descriptor(intf, custom_match=lambda e: usb.util.endpoint_direction(e.bEndpointAddress) == usb.util.ENDPOINT_OUT)

# Print data
data = b'\x1B\x40'  # Init
data += b'\x1B\x61\x01'  # Center
data += b'\x1B\x21\x30\x1B\x45\x01'  # Double + Bold
data += b'BTN Syariah\n'
data += b'\x1B\x45\x00\x1B\x21\x00'  # Normal
data += b'Jl. Sopo Del No 56\n'
data += b'Jakarta Selatan\n'
data += b'--------------------------------\n'
data += b'Nomor Antrian\n\n'
data += b'\x1B\x21\x30\x1B\x45\x01'  # Double + Bold
data += b'A001\n'
data += b'\x1B\x45\x00\x1B\x21\x00'  # Normal
data += b'\nCUSTOMER SERVICE\n\n'
data += datetime.now().strftime("%d/%m/%Y %H:%M").encode() + b'\n'
data += b'--------------------------------\n'
data += b'TEST PRINT BERHASIL!\n'
data += b'\n\n\n'
data += b'\x1D\x56\x00'  # Cut

# Send
ep.write(data)
print("Print berhasil dikirim!")
