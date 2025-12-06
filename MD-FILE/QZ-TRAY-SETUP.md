# Setup QZ Tray untuk Print Otomatis

Panduan lengkap menggunakan QZ Tray untuk print otomatis ke thermal printer.

## 📥 Download & Install QZ Tray

### 1. Download QZ Tray
- Kunjungi: https://qz.io/download/
- Pilih versi sesuai OS:
  - **Windows**: `qz-tray-x.x.x.exe`
  - **Linux**: `qz-tray-x.x.x.run`
  - **macOS**: `qz-tray-x.x.x.pkg`

### 2. Install QZ Tray
- **Windows**: Double-click file `.exe` dan ikuti wizard
- **Linux**: 
  ```bash
  chmod +x qz-tray-x.x.x.run
  ./qz-tray-x.x.x.run
  ```
- **macOS**: Double-click file `.pkg` dan ikuti wizard

### 3. Jalankan QZ Tray
- QZ Tray akan berjalan di system tray (pojok kanan bawah Windows)
- Icon QZ Tray akan muncul (logo Q berwarna hijau jika aktif)
- QZ Tray harus berjalan setiap kali akan print

## 🖨️ Setup Printer

### 1. Install Driver Printer Thermal
- Install driver printer thermal sesuai merk (EPSON, Star, Bixolon, dll)
- Pastikan printer terdeteksi di sistem
- Test print dari aplikasi lain (Notepad, Word) untuk memastikan printer berfungsi

### 2. Cek Nama Printer

**Opsi 1: Auto-Detect (Recommended)**
- Buka Pengaturan Printer di admin panel
- Centang "Gunakan QZ Tray"
- Klik tombol **"🔍 Deteksi Printer"**
- Pilih printer dari daftar yang muncul
- Nama printer otomatis terisi!

**Opsi 2: Manual**

**Windows:**
- Buka `Control Panel` → `Devices and Printers`
- Lihat nama printer yang terinstall
- Contoh: `POS-58`, `EPSON TM-T82`, `Star TSP143`

**Linux:**
```bash
lpstat -p -d
```

**macOS:**
```bash
lpstat -p -d
```

**PENTING:** Catat nama printer dengan TEPAT (case-sensitive)

## ⚙️ Konfigurasi di Aplikasi

### 1. Login sebagai Admin
- Buka browser: http://localhost:3000
- Login dengan username: `admin`, password: `admin123`

### 2. Masuk ke Pengaturan Printer
- Klik menu **"Pengaturan Printer"**
- Atau akses: http://localhost:3000/printer-settings

### 3. Isi Form Pengaturan

**Judul Struk:**
```
BTN Syariah
```

**Alamat:**
```
Jl. Sopo Del No 56 Jakarta Selatan
```

**Catatan Footer (Opsional):**
```
Terima kasih atas kunjungan Anda
```

**Ukuran Kertas:**
- Pilih `58mm` untuk printer thermal kecil
- Pilih `80mm` untuk printer thermal besar

**✅ Centang: "Gunakan QZ Tray untuk Print Otomatis"**

**Nama Printer QZ Tray:**
- Klik **"🔍 Deteksi Printer"** untuk auto-detect
- Atau ketik manual:
```
POS-58
```
(Ganti dengan nama printer Anda yang TEPAT)

### 4. Simpan Pengaturan
- Klik **"💾 Simpan Pengaturan"**
- Tunggu konfirmasi berhasil

### 5. Test Print
- Klik **"🖨️ Test Print"**
- Printer akan langsung print tanpa dialog
- Jika gagal, cek troubleshooting di bawah

## 🎯 Cara Kerja

### Mode Browser Print (Default)
- Checkbox QZ Tray: **TIDAK DICENTANG**
- Saat ambil nomor → Browser buka dialog print (Ctrl+P)
- User harus klik "Print" manual
- Bisa pakai printer apapun (thermal, inkjet, laser)

### Mode QZ Tray (Otomatis)
- Checkbox QZ Tray: **DICENTANG**
- Saat ambil nomor → Langsung print otomatis
- Tidak ada dialog print
- Harus pakai thermal printer yang sudah dikonfigurasi
- QZ Tray harus berjalan di background

## 🔧 Troubleshooting

### ❌ Muncul "Anonymous request wants to access printer"

**Penyebab:**
Security prompt dari QZ Tray (normal)

**Solusi:**
1. Klik **"Always Allow"** (recommended)
2. Atau whitelist di QZ Tray Site Manager
3. Prompt hanya muncul 1x pertama kali
4. Detail: [QZ-TRAY-SECURITY.md](QZ-TRAY-SECURITY.md)

### ❌ Error: "Printer tidak terhubung"

**Penyebab:**
1. QZ Tray tidak berjalan
2. Nama printer salah
3. Printer tidak terinstall

**Solusi:**
1. Pastikan QZ Tray berjalan (cek system tray)
2. Cek nama printer di sistem (case-sensitive!)
3. Test print dari aplikasi lain
4. Restart QZ Tray

### ❌ Print tidak keluar

**Penyebab:**
1. Printer offline
2. Kertas habis
3. Driver printer bermasalah

**Solusi:**
1. Cek status printer di sistem
2. Cek kertas dan tinta
3. Reinstall driver printer
4. Test print dari Notepad

### ❌ Format print berantakan

**Penyebab:**
1. Ukuran kertas salah
2. Driver printer tidak cocok

**Solusi:**
1. Ubah ukuran kertas di pengaturan (58mm/80mm)
2. Gunakan driver printer yang sesuai
3. Cek manual printer untuk ESC/POS commands

### ❌ QZ Tray tidak connect

**Penyebab:**
1. QZ Tray belum diinstall
2. Port blocked oleh firewall
3. Browser tidak support WebSocket

**Solusi:**
1. Install QZ Tray dari https://qz.io/download/
2. Allow QZ Tray di firewall
3. Gunakan browser modern (Chrome, Firefox, Edge)

## 📝 Tips & Best Practices

### 1. Gunakan Auto-Detect Printer
```
✅ Klik "🔍 Deteksi Printer" di admin panel
✅ Pilih dari daftar yang muncul
✅ Nama printer otomatis terisi dengan benar
```

Atau manual:
```javascript
// ✅ BENAR (sesuai nama di sistem)
qz_printer_name: "POS-58"

// ❌ SALAH (typo atau case berbeda)
qz_printer_name: "pos-58"
qz_printer_name: "POS 58"
```

### 2. Test Print Sebelum Produksi
- Selalu test print setelah konfigurasi
- Cek format struk sudah sesuai
- Pastikan semua data tercetak dengan benar

### 3. Backup Konfigurasi
- Catat nama printer yang digunakan
- Screenshot pengaturan yang berhasil
- Simpan untuk referensi jika perlu setup ulang

### 4. Auto-Start QZ Tray
**Windows:**
- Copy shortcut QZ Tray ke folder Startup
- Lokasi: `C:\Users\[Username]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

**Linux:**
- Tambahkan ke autostart applications
- Atau edit `~/.config/autostart/qz-tray.desktop`

**macOS:**
- System Preferences → Users & Groups → Login Items
- Tambahkan QZ Tray

### 5. Fallback ke Browser Print
- Jika QZ Tray error, sistem otomatis fallback ke browser print
- User tetap bisa print dengan Ctrl+P
- Tidak ada data yang hilang

## 🔄 Migrasi dari Browser Print ke QZ Tray

### Langkah Migrasi:
1. Install QZ Tray di komputer client
2. Test dengan mode browser print dulu (checkbox OFF)
3. Setelah yakin, aktifkan QZ Tray (checkbox ON)
4. Test print beberapa kali
5. Monitor selama 1-2 hari
6. Jika stabil, gunakan permanent

### Rollback ke Browser Print:
1. Login sebagai admin
2. Masuk ke Pengaturan Printer
3. **Uncheck** "Gunakan QZ Tray untuk Print Otomatis"
4. Simpan pengaturan
5. Sistem kembali ke mode browser print

## 📊 Perbandingan Mode Print

| Fitur | Browser Print | QZ Tray |
|-------|--------------|---------|
| Install | Tidak perlu | Perlu install QZ Tray |
| Printer | Semua jenis | Thermal printer |
| Otomatis | Manual (Ctrl+P) | Otomatis |
| Dialog | Ada | Tidak ada |
| Setup | Mudah | Perlu konfigurasi |
| Maintenance | Rendah | Perlu monitor QZ Tray |
| Cocok untuk | Printer biasa | Thermal printer |

## 🆘 Support

Jika masih ada masalah:
1. Cek dokumentasi QZ Tray: https://qz.io/wiki/
2. Cek log QZ Tray di system tray → Right-click → View Logs
3. Test dengan sample code QZ Tray: https://demo.qz.io/
4. Pastikan versi QZ Tray terbaru

## 📚 Referensi

- QZ Tray Official: https://qz.io/
- QZ Tray Documentation: https://qz.io/wiki/
- ESC/POS Commands: https://reference.epson-biz.com/modules/ref_escpos/
- Supported Printers: https://qz.io/wiki/supported-printers

---

**Catatan:** QZ Tray adalah software gratis untuk penggunaan non-komersial. Untuk penggunaan komersial, cek lisensi di https://qz.io/pricing/
