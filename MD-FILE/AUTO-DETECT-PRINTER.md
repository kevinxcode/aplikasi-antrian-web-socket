# Auto-Detect Printer dengan QZ Tray

Fitur deteksi otomatis printer yang terhubung ke sistem.

## 🎯 Cara Menggunakan

### 1. Pastikan QZ Tray Berjalan
- QZ Tray harus sudah terinstall
- QZ Tray harus berjalan (cek system tray)
- Icon QZ Tray berwarna hijau = aktif

### 2. Buka Pengaturan Printer
```
http://localhost:3000/printer-settings
```
- Login sebagai admin
- Klik menu "Pengaturan Printer"

### 3. Aktifkan QZ Tray
- ✅ Centang "Gunakan QZ Tray untuk Print Otomatis"
- Field "Nama Printer QZ Tray" akan muncul

### 4. Klik Tombol "🔍 Deteksi Printer"
- Sistem akan connect ke QZ Tray
- Mendeteksi semua printer yang terhubung
- Menampilkan daftar printer

### 5. Pilih Printer
- Klik printer yang ingin digunakan
- Nama printer otomatis terisi di field
- Printer yang dipilih akan highlight hijau

### 6. Simpan & Test
- Klik "💾 Simpan Pengaturan"
- Klik "🖨️ Test Print" untuk test

## 📋 Contoh Output

### Berhasil Deteksi:
```
✅ Ditemukan 3 printer

🖨️ POS-58
🖨️ EPSON TM-T82
🖨️ Microsoft Print to PDF
```

### Tidak Ada Printer:
```
⚠️ Tidak ada printer yang terdeteksi
```

### QZ Tray Tidak Berjalan:
```
❌ QZ Tray tidak berjalan!

Pastikan:
1. QZ Tray sudah terinstall
2. QZ Tray sedang berjalan (cek system tray)
3. Refresh halaman ini
```

## 🔧 Cara Kerja

### 1. Connect ke QZ Tray
```javascript
await qz.websocket.connect();
```
- Membuka koneksi WebSocket ke QZ Tray
- QZ Tray berjalan di localhost:8181 (default)

### 2. Get List Printer
```javascript
const printers = await qz.printers.find();
```
- QZ Tray query sistem operasi
- Mendapatkan semua printer yang terinstall
- Return array nama printer

### 3. Display List
```javascript
printers.forEach(printer => {
    // Tampilkan di UI
    // User bisa klik untuk pilih
});
```

### 4. Select Printer
```javascript
document.getElementById('qz_printer_name').value = printerName;
```
- Nama printer otomatis terisi
- Siap untuk disimpan

## 🎨 UI/UX

### Tombol Deteksi
```
[Input Nama Printer] [🔍 Deteksi Printer]
```
- Tombol di samping input field
- Warna hijau untuk mudah dilihat
- Icon 🔍 untuk indikasi search

### Daftar Printer
```
┌─────────────────────────────┐
│ Pilih Printer:              │
├─────────────────────────────┤
│ 🖨️ POS-58                   │ ← Hover: biru
│ 🖨️ EPSON TM-T82             │ ← Selected: hijau
│ 🖨️ Microsoft Print to PDF   │
└─────────────────────────────┘
```
- Scrollable jika banyak printer
- Hover effect untuk feedback
- Selected state untuk konfirmasi

## ⚡ Performance

### Speed:
- Connect: ~500ms
- Detect: ~200ms
- Total: **< 1 detik**

### Caching:
- Tidak ada caching
- Setiap klik = fresh detect
- Memastikan data terbaru

## 🔒 Security

### WebSocket Connection:
- Localhost only (127.0.0.1:8181)
- Tidak bisa diakses dari luar
- QZ Tray handle authentication

### Printer Access:
- Read-only (hanya list printer)
- Tidak bisa ubah setting printer
- Tidak bisa print tanpa user action

## 🐛 Troubleshooting

### Error: "QZ Tray library belum dimuat"
**Penyebab:** Script QZ Tray belum load
**Solusi:** Refresh halaman dan tunggu beberapa detik

### Error: "Unable to establish connection"
**Penyebab:** QZ Tray tidak berjalan
**Solusi:** 
1. Jalankan QZ Tray
2. Cek icon di system tray
3. Restart QZ Tray jika perlu

### Daftar Printer Kosong
**Penyebab:** Tidak ada printer terinstall
**Solusi:**
1. Install driver printer
2. Cek printer di Control Panel
3. Test print dari aplikasi lain

### Printer Tidak Muncul di List
**Penyebab:** Driver printer bermasalah
**Solusi:**
1. Reinstall driver printer
2. Restart komputer
3. Cek printer status (online/offline)

## 💡 Tips

### 1. Refresh List Printer
- Klik "🔍 Deteksi Printer" lagi
- Tidak perlu refresh halaman
- Otomatis update list

### 2. Filter Printer
- Pilih printer thermal saja
- Abaikan "Microsoft Print to PDF"
- Abaikan "Fax" atau printer virtual

### 3. Test Setelah Pilih
- Langsung test print setelah pilih
- Pastikan printer yang benar
- Cek format struk

### 4. Backup Nama Printer
- Screenshot daftar printer
- Catat nama printer yang berhasil
- Untuk referensi jika perlu setup ulang

## 🔄 Workflow

```
1. User klik "🔍 Deteksi Printer"
   ↓
2. Connect ke QZ Tray
   ↓
3. Get list printer dari sistem
   ↓
4. Tampilkan daftar printer
   ↓
5. User klik printer yang diinginkan
   ↓
6. Nama printer otomatis terisi
   ↓
7. User klik "Simpan"
   ↓
8. Test print
   ↓
9. Selesai! ✅
```

## 📊 Supported Printers

QZ Tray support semua printer yang terinstall di sistem:

### Thermal Printers:
- ✅ EPSON TM series (TM-T82, TM-T88, dll)
- ✅ Star TSP series (TSP143, TSP650, dll)
- ✅ Bixolon SRP series
- ✅ Citizen CT-S series
- ✅ Generic POS-58, POS-80

### Regular Printers:
- ✅ HP, Canon, Brother (inkjet/laser)
- ✅ PDF printers
- ✅ Network printers

### Virtual Printers:
- ✅ Microsoft Print to PDF
- ✅ Microsoft XPS Document Writer
- ⚠️ Tidak recommended untuk struk

## 🎓 Advanced

### Custom Filter Printer
Jika ingin filter hanya thermal printer:

```javascript
const printers = await qz.printers.find();
const thermalPrinters = printers.filter(p => 
    p.includes('POS') || 
    p.includes('EPSON') || 
    p.includes('Star') ||
    p.includes('Bixolon')
);
```

### Get Default Printer
```javascript
const defaultPrinter = await qz.printers.getDefault();
console.log('Default printer:', defaultPrinter);
```

### Get Printer Details
```javascript
const details = await qz.printers.details(printerName);
console.log('Printer details:', details);
```

## 📚 Referensi

- **QZ Tray Printer API:** https://qz.io/wiki/printer-api
- **QZ Tray WebSocket:** https://qz.io/wiki/websocket-api
- **Supported Printers:** https://qz.io/wiki/supported-printers

---

**Auto-detect printer membuat setup lebih mudah dan cepat! 🚀**
