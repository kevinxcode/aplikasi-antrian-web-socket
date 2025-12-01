# 🖨️ Printer Thermal 58mm - Ready to Use!

Fitur cetak struk otomatis untuk sistem antrian sudah siap digunakan!

## ⚡ Quick Start (5 Menit)

```bash
# 1. Install dependencies
cd app
npm install

# 2. Test printer
node test-printer.js

# 3. Jalankan aplikasi
npm start

# 4. Buka browser
# http://localhost:3000
# Login: admin / admin123
# Menu: Printer → Konfigurasi → Test Print
```

## 📋 Format Struk

```
        BTN Syariah
Jl. Sopo Del No 56 Jakarta Selatan
--------------------------------
      Nomor Antrian

         A001

     CUSTOMER SERVICE

Senin, 1 Desember 2025 15:00

Terima kasih atas kunjungan Anda
--------------------------------
```

## 🎯 Fitur

- ✅ Auto-print saat ambil nomor
- ✅ Konfigurasi via admin panel
- ✅ Preview real-time
- ✅ Test print button
- ✅ Non-blocking (tidak ganggu sistem)
- ✅ UTF-8 support
- ✅ Nomor besar (double size)
- ✅ Auto-cut kertas

## 📁 File Penting

| File | Deskripsi |
|------|-----------|
| `printer.js` | Modul printer utama |
| `test-printer.js` | Test printer standalone |
| `example-print.js` | Contoh berbagai cara print |
| `public/printer-settings.html` | Halaman admin |

## 🔧 Cara Kerja

1. Customer klik button di `/ambil-nomor.html`
2. Sistem generate nomor antrian
3. **Printer otomatis cetak struk** 🖨️
4. Nomor masuk ke antrian
5. Display update real-time

## 🐛 Troubleshooting

### Printer tidak terdeteksi?
```bash
node -e "const usb = require('escpos-usb'); console.log(usb.USB.findPrinter());"
```

### Error LIBUSB_ERROR_ACCESS?
1. Download Zadig: https://zadig.akeo.ie/
2. Install WinUSB driver untuk printer
3. Restart aplikasi

### Print tidak keluar?
- Cek kertas thermal
- Cek printer menyala
- Test print dari admin panel

## 📚 Dokumentasi Lengkap

- **Setup**: `../PRINTER-SETUP.md`
- **Quick Start**: `../QUICK-START-PRINTER.md`
- **API**: `../PRINTER-API.md`

## 💡 Tips

1. Test print setiap hari sebelum operasional
2. Siapkan kertas thermal cadangan
3. Bersihkan head printer setiap minggu
4. Monitor log error di console

## 🎉 Selamat!

Sistem antrian dengan printer thermal siap digunakan!

---

**Need help?** Baca dokumentasi lengkap atau cek `example-print.js` untuk contoh kode.
