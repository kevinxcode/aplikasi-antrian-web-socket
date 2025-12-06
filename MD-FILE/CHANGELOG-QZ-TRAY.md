# Changelog - QZ Tray Integration

## 🎉 Fitur Baru: Print Otomatis dengan QZ Tray

### ✨ Yang Ditambahkan

#### 1. **Auto-Detect Printer** 🆕
- Tombol "🔍 Deteksi Printer" di admin panel
- Otomatis scan semua printer yang terhubung
- Klik untuk pilih printer dari daftar
- Nama printer otomatis terisi dengan benar
- Tidak perlu ketik manual (menghindari typo)

#### 2. **Dual Mode Printing**
- **Browser Print (Default):** Print manual dengan Ctrl+P
- **QZ Tray (Optional):** Print otomatis ke thermal printer

#### 2. **Konfigurasi QZ Tray di Admin Panel**
- Checkbox untuk aktifkan/nonaktifkan QZ Tray
- Input nama printer thermal
- Auto-fallback ke browser print jika QZ Tray error

#### 3. **Database Schema Update**
- Tambah kolom `use_qz_tray` (BOOLEAN)
- Tambah kolom `qz_printer_name` (VARCHAR)
- Rename kolom `footer_note` → `footer`
- Rename kolom `paper_width` → `paper_size`

#### 4. **API Endpoint Update**
- `/api/printer-settings` (GET) - Public access untuk ambil nomor
- `/api/printer-settings` (POST) - Support QZ Tray config

#### 5. **Frontend Integration**
- Load QZ Tray library dari CDN
- Auto-detect mode print (QZ Tray vs Browser)
- ESC/POS commands untuk thermal printer
- Fallback mechanism jika QZ Tray gagal

### 📝 File yang Dimodifikasi

1. **app/public/ambil-nomor.html**
   - Tambah QZ Tray libraries (js-sha256, qz-tray)

2. **app/public/ambil-nomor.js**
   - Fungsi `loadQZSettings()` - Load config QZ Tray
   - Fungsi `printWithQZ()` - Print dengan QZ Tray
   - Fungsi `printWithBrowser()` - Fallback browser print
   - Auto-detect mode print

3. **app/public/printer-settings.html**
   - Checkbox "Gunakan QZ Tray"
   - Input "Nama Printer QZ Tray"
   - Toggle visibility field QZ Tray

4. **app/index.js**
   - Update API `/api/printer-settings` (GET) - Public access
   - Update API `/api/printer-settings` (POST) - Support QZ Tray fields

5. **app/db.js**
   - Tambah kolom `use_qz_tray`
   - Tambah kolom `qz_printer_name`
   - Tambah kolom `footer` dan `paper_size`
   - Migration dari kolom lama ke baru

### 📚 Dokumentasi Baru

1. **QZ-TRAY-SETUP.md**
   - Panduan download & install QZ Tray
   - Setup printer thermal
   - Konfigurasi di aplikasi
   - Troubleshooting lengkap
   - Tips & best practices

2. **README.md**
   - Update section printer setup
   - Tambah info QZ Tray
   - Link ke dokumentasi QZ Tray

### 🔄 Cara Migrasi

#### Dari Versi Lama (Browser Print Only)

1. **Pull update code:**
   ```bash
   git pull origin main
   ```

2. **Restart aplikasi:**
   ```bash
   # Jika pakai Docker
   docker-compose down
   docker-compose up -d --build
   
   # Jika manual
   cd app
   npm install
   npm start
   ```

3. **Database akan auto-migrate:**
   - Kolom baru akan ditambahkan otomatis
   - Data lama tetap aman
   - Default: `use_qz_tray = FALSE` (tetap pakai browser print)

4. **Setup QZ Tray (Optional):**
   - Ikuti panduan di [QZ-TRAY-SETUP.md](QZ-TRAY-SETUP.md)
   - Aktifkan di admin panel
   - Test print

### ⚙️ Konfigurasi

#### Mode Browser Print (Default)
```javascript
{
  "use_qz_tray": false,
  "qz_printer_name": ""
}
```
- Tidak perlu install apapun
- Print manual dengan Ctrl+P
- Bisa pakai printer apapun

#### Mode QZ Tray (Otomatis)
```javascript
{
  "use_qz_tray": true,
  "qz_printer_name": "POS-58"
}
```
- Perlu install QZ Tray
- Print otomatis tanpa dialog
- Harus pakai thermal printer

### 🐛 Bug Fixes

- Fix: Printer settings API sekarang bisa diakses public (untuk ambil nomor)
- Fix: Database migration untuk kolom lama (`footer_note`, `paper_width`)
- Fix: Fallback mechanism jika QZ Tray tidak tersedia

### 🔒 Security

- QZ Tray library loaded dari CDN official (jsdelivr)
- Printer settings tetap require admin auth untuk update
- Public endpoint hanya untuk read settings (tidak bisa ubah)

### 📊 Performa

- QZ Tray print lebih cepat (langsung ke printer)
- Tidak ada overhead browser print dialog
- Cocok untuk high-volume queue

### 🧪 Testing

#### Test Browser Print:
1. Login admin
2. Pengaturan Printer
3. **Uncheck** "Gunakan QZ Tray"
4. Simpan
5. Ambil nomor → Dialog print muncul

#### Test QZ Tray:
1. Install QZ Tray
2. Jalankan QZ Tray
3. Login admin
4. Pengaturan Printer
5. **Check** "Gunakan QZ Tray"
6. Isi nama printer (contoh: "POS-58")
7. Simpan
8. Test Print → Langsung print tanpa dialog
9. Ambil nomor → Langsung print tanpa dialog

### 🔮 Future Enhancements

- [x] Auto-detect printer name dari QZ Tray ✅ **DONE!**
- [ ] Support multiple printer (CS dan Teller beda printer)
- [ ] Custom ESC/POS template
- [ ] Print logo/image di struk
- [ ] Print barcode/QR code
- [ ] Reprint struk dari history

### 📞 Support

Jika ada masalah:
1. Cek [QZ-TRAY-SETUP.md](QZ-TRAY-SETUP.md) untuk troubleshooting
2. Pastikan QZ Tray versi terbaru
3. Test dengan demo QZ Tray: https://demo.qz.io/
4. Cek browser console untuk error message

### 📅 Version

- **Version:** 2.0.0
- **Release Date:** 2025
- **Compatibility:** Node.js 18+, PostgreSQL 12+
- **QZ Tray:** 2.2.2+

---

**Note:** QZ Tray adalah optional feature. Aplikasi tetap bisa berjalan normal dengan browser print jika QZ Tray tidak digunakan.
