# Troubleshooting Rongta 58mm Series Printer

Panduan lengkap untuk mengatasi masalah printer Rongta 58mm yang tidak terdeteksi meskipun status idle.

## 🔍 Identifikasi Masalah

### Gejala Umum
- Printer status: **IDLE** (siap)
- Lampu indikator: **MENYALA**
- Tapi: **TIDAK TERDETEKSI** oleh aplikasi

## ✅ Solusi Step-by-Step

### 1. Cek Koneksi Fisik

```bash
# Pastikan:
✓ Kabel USB terpasang dengan benar
✓ Printer dalam keadaan menyala
✓ Lampu indikator hidup (biasanya hijau/biru)
✓ Tidak ada paper jam
```

### 2. Test Deteksi Printer

Jalankan script test khusus Rongta:

```bash
cd app
node test-rongta.js
```

**Output yang diharapkan:**
```
🔍 Rongta 58mm Series - Printer Detection Test

📊 Total USB devices ditemukan: 1

🖨️  Printer #1:
   Vendor ID:  0x1FC9 (8137)
   Product ID: 0x2016 (8214)
   ✅ RONGTA 58MM SERIES TERDETEKSI!
   Status: IDLE - Siap digunakan

✅ Test print berhasil!
```

### 3. Cek di Admin Panel

1. Login sebagai **admin**
2. Buka **Pengaturan Printer**
3. Klik tombol **"🔍 Deteksi Printer USB"**
4. Lihat hasil deteksi

**Jika berhasil:**
```
✅ Printer Terdeteksi (1):
🎯 Rongta 58mm Series
Vendor ID: 0x1FC9 | Product ID: 0x2016
✓ Siap digunakan untuk print otomatis
```

### 4. Troubleshooting Windows

#### A. Cek Device Manager

1. Tekan `Win + X` → Device Manager
2. Cari di kategori:
   - **Printers**
   - **Universal Serial Bus devices**
   - **Other devices** (jika ada tanda seru kuning)

#### B. Install Driver (Jika Perlu)

Jika printer muncul dengan tanda seru kuning:

1. Download driver Rongta dari website resmi
2. Atau gunakan driver generic ESC/POS
3. Install driver
4. Restart komputer
5. Test ulang deteksi

#### C. Permission USB (Windows)

Jika error `LIBUSB_ERROR_ACCESS`:

**Solusi 1: Run as Administrator**
```bash
# Jalankan Command Prompt as Administrator
cd c:\xampp\htdocs\project-dev\1.antrial-app\app
node test-rongta.js
```

**Solusi 2: Install Zadig (USB Driver)**

1. Download Zadig: https://zadig.akeo.ie/
2. Jalankan Zadig
3. Options → List All Devices
4. Pilih printer Rongta dari dropdown
5. Pilih driver: **WinUSB**
6. Klik **Install Driver** atau **Replace Driver**
7. Restart aplikasi
8. Test ulang

### 5. Cek Port USB

```bash
# Coba port USB yang berbeda:
1. Cabut kabel USB dari port saat ini
2. Colok ke port USB lain (usahakan USB 2.0)
3. Tunggu Windows mendeteksi
4. Test ulang deteksi
```

### 6. Restart Printer

```bash
1. Matikan printer (tombol power)
2. Cabut kabel USB
3. Tunggu 10 detik
4. Colok kembali kabel USB
5. Nyalakan printer
6. Tunggu lampu indikator stabil
7. Test ulang deteksi
```

## 🔧 Konfigurasi di Aplikasi

### Enable USB Print Otomatis

1. Login sebagai **admin**
2. Buka **Pengaturan Printer**
3. Centang: ☑️ **"Gunakan USB Print Otomatis"**
4. Klik **"💾 Simpan Pengaturan"**
5. Klik **"🖨️ Test Print"**

Jika berhasil, struk test akan langsung keluar dari printer!

## 📋 Spesifikasi Rongta 58mm

```
Brand:       Rongta
Model:       58mm Series (RP58, RP80, dll)
Vendor ID:   0x1FC9 (8137)
Product ID:  Varies (0x2016, 0x2015, dll)
Interface:   USB
Protocol:    ESC/POS
Paper:       58mm thermal paper
```

## 🐛 Error Messages & Solusi

### Error: "Tidak ada printer USB yang terdeteksi"

**Penyebab:**
- Printer tidak terhubung
- Driver belum terinstall
- USB port bermasalah

**Solusi:**
1. Cek koneksi fisik
2. Install driver
3. Coba port USB lain
4. Restart printer dan komputer

### Error: "LIBUSB_ERROR_ACCESS"

**Penyebab:**
- Permission USB tidak cukup
- Driver USB tidak sesuai

**Solusi:**
1. Run as Administrator
2. Install Zadig (WinUSB driver)
3. Restart aplikasi

### Error: "Gagal membuka koneksi printer"

**Penyebab:**
- Printer sedang digunakan aplikasi lain
- Driver conflict

**Solusi:**
1. Tutup aplikasi lain yang menggunakan printer
2. Restart printer
3. Restart aplikasi

### Error: "Print timeout"

**Penyebab:**
- Printer offline
- Paper jam
- Kertas habis

**Solusi:**
1. Cek status printer (lampu indikator)
2. Cek kertas thermal
3. Buka cover, cek paper jam
4. Restart printer

## ✅ Checklist Sebelum Produksi

```
☐ Printer terdeteksi di Device Manager
☐ Test deteksi berhasil (node test-rongta.js)
☐ Test print berhasil dari admin panel
☐ USB Print Otomatis sudah diaktifkan
☐ Struk keluar dengan format yang benar
☐ Kertas thermal cadangan tersedia
☐ Printer backup siap (jika ada)
```

## 🎯 Tips Maintenance

1. **Bersihkan head printer** setiap minggu dengan cleaning card
2. **Gunakan kertas thermal berkualitas** untuk hasil optimal
3. **Hindari paper jam** dengan memasang kertas dengan benar
4. **Backup printer** untuk antisipasi kerusakan
5. **Monitor stok kertas** secara berkala

## 📞 Support

Jika masih bermasalah setelah mengikuti panduan ini:

1. Cek log error di console aplikasi
2. Screenshot hasil deteksi printer
3. Catat Vendor ID dan Product ID
4. Hubungi support Rongta atau vendor printer

## 🔗 Link Berguna

- Rongta Official: http://www.rongtatech.com/
- Zadig USB Driver: https://zadig.akeo.ie/
- ESC/POS Documentation: https://github.com/song940/node-escpos

---

**Semoga printer Rongta 58mm Series Anda segera terdeteksi dan berfungsi dengan baik! 🎉**
