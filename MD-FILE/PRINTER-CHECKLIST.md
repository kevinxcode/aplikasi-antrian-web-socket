# ✅ Checklist Instalasi Printer Thermal

Gunakan checklist ini untuk memastikan semua langkah instalasi sudah benar.

## 📦 Pre-Installation

- [ ] Node.js 18+ sudah terinstall
- [ ] Printer thermal 58mm tersedia
- [ ] Kabel USB tersedia
- [ ] Port USB tersedia di komputer

## 🔧 Installation Steps

### 1. Install Dependencies
- [ ] Masuk ke folder `app`
- [ ] Jalankan `npm install`
- [ ] Dependencies `escpos` dan `escpos-usb` terinstall
- [ ] Tidak ada error saat instalasi

### 2. Hardware Setup
- [ ] Printer thermal dicolok ke USB
- [ ] Printer dalam keadaan menyala
- [ ] Lampu indikator printer menyala
- [ ] Kertas thermal sudah terpasang

### 3. Test Printer
- [ ] Jalankan `node test-printer.js`
- [ ] Printer terdeteksi (muncul vendor & product ID)
- [ ] Struk test berhasil dicetak
- [ ] Struk terbaca dengan jelas

### 4. Database Setup
- [ ] Aplikasi sudah pernah dijalankan minimal 1x
- [ ] Tabel `printer_settings` sudah dibuat
- [ ] Default settings sudah ada di database

### 5. Application Setup
- [ ] Jalankan `npm start`
- [ ] Aplikasi berjalan tanpa error
- [ ] Bisa akses `http://localhost:3000`

### 6. Admin Configuration
- [ ] Login sebagai admin berhasil
- [ ] Menu "Printer" muncul di navigation
- [ ] Halaman pengaturan printer bisa dibuka
- [ ] Form pengaturan bisa diisi

### 7. Test Configuration
- [ ] Isi judul struk (e.g., "BTN Syariah")
- [ ] Isi alamat lengkap
- [ ] Isi catatan footer (opsional)
- [ ] Preview struk update real-time
- [ ] Klik "Test Print" berhasil
- [ ] Struk test keluar dari printer
- [ ] Klik "Simpan Pengaturan" berhasil

### 8. Integration Test
- [ ] Buka `/ambil-nomor.html`
- [ ] Klik button "Customer Service"
- [ ] Printer otomatis cetak struk
- [ ] Nomor antrian muncul di struk
- [ ] Format struk sesuai konfigurasi
- [ ] Nomor masuk ke antrian
- [ ] Display update real-time

### 9. Error Handling Test
- [ ] Cabut printer saat aplikasi jalan
- [ ] Ambil nomor tetap berhasil (non-blocking)
- [ ] Error dicatat di console
- [ ] Sistem tetap berjalan normal
- [ ] Colok printer kembali
- [ ] Print berfungsi normal lagi

### 10. Final Check
- [ ] Semua fitur berjalan normal
- [ ] Tidak ada error di console
- [ ] Struk tercetak dengan benar
- [ ] Konfigurasi tersimpan di database
- [ ] Admin bisa ubah pengaturan
- [ ] Test print berfungsi

## 🐛 Troubleshooting Checklist

### Jika Printer Tidak Terdeteksi:
- [ ] Cek kabel USB terpasang dengan benar
- [ ] Coba port USB yang berbeda
- [ ] Restart printer
- [ ] Restart komputer
- [ ] Cek driver printer terinstall
- [ ] Jalankan command: `node -e "const usb = require('escpos-usb'); console.log(usb.USB.findPrinter());"`

### Jika Error LIBUSB_ERROR_ACCESS (Windows):
- [ ] Download Zadig dari https://zadig.akeo.ie/
- [ ] Jalankan Zadig sebagai Administrator
- [ ] Pilih printer dari dropdown list
- [ ] Pilih driver "WinUSB"
- [ ] Klik "Install Driver" atau "Replace Driver"
- [ ] Tunggu instalasi selesai
- [ ] Restart aplikasi
- [ ] Test printer lagi

### Jika Print Tidak Keluar:
- [ ] Cek kertas thermal masih ada
- [ ] Cek kertas terpasang dengan benar
- [ ] Cek printer tidak paper jam
- [ ] Cek printer tidak error (lampu berkedip)
- [ ] Test print dari button admin
- [ ] Cek log error di console
- [ ] Restart printer
- [ ] Test lagi

### Jika Struk Tidak Terbaca:
- [ ] Cek encoding UTF-8 di printer.js
- [ ] Cek kertas thermal berkualitas baik
- [ ] Bersihkan head printer
- [ ] Cek suhu printer tidak terlalu panas
- [ ] Cek setting printer (jika ada)

## 📊 Performance Checklist

- [ ] Print time < 3 detik
- [ ] Tidak ada delay saat ambil nomor
- [ ] Sistem tetap responsive saat print
- [ ] Memory usage normal
- [ ] CPU usage normal
- [ ] Tidak ada memory leak

## 🔐 Security Checklist

- [ ] Hanya admin bisa akses pengaturan printer
- [ ] User CS/Teller tidak bisa ubah pengaturan
- [ ] Input validation berfungsi
- [ ] SQL injection protected
- [ ] Session management berfungsi
- [ ] Audit log tercatat di database

## 📝 Documentation Checklist

- [ ] README.md sudah update
- [ ] PRINTER-SETUP.md tersedia
- [ ] QUICK-START-PRINTER.md tersedia
- [ ] PRINTER-API.md tersedia
- [ ] Contoh kode tersedia (example-print.js)
- [ ] Test script tersedia (test-printer.js)

## 🎯 Production Ready Checklist

- [ ] Semua test berhasil
- [ ] Dokumentasi lengkap
- [ ] Error handling berfungsi
- [ ] Logging berfungsi
- [ ] Backup printer tersedia
- [ ] Kertas thermal cadangan tersedia
- [ ] SOP penggunaan sudah dibuat
- [ ] Training user sudah dilakukan

## ✨ Final Verification

Setelah semua checklist di atas selesai:

- [ ] Restart aplikasi dari awal
- [ ] Test full flow: ambil nomor → print → display
- [ ] Test dengan berbagai skenario
- [ ] Test error handling
- [ ] Dokumentasi sudah dibaca
- [ ] Tim sudah ditraining

## 🎉 Congratulations!

Jika semua checklist sudah ✅, maka:

**FITUR PRINTER THERMAL SIAP PRODUCTION! 🚀**

---

**Catatan:**
- Simpan checklist ini untuk referensi
- Gunakan untuk troubleshooting
- Update jika ada perubahan
- Share ke tim untuk training

**Last Updated:** 2025-01-01
