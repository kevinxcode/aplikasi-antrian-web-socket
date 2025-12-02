# 🖨️ Rekomendasi Printer Thermal untuk Aplikasi Antrian

## ✅ Printer yang Support (ESC/POS Compatible)

### 1. **EPSON TM-T82** (Recommended)
- **Harga:** Rp 2.5 - 3 juta
- **Ukuran:** 80mm
- **Interface:** USB, Serial, Ethernet
- **Kecepatan:** 200mm/detik
- **Keunggulan:** Reliable, support ESC/POS, auto-cutter
- **Support:** ✅ 100% compatible dengan escpos-usb

### 2. **EPSON TM-T20II**
- **Harga:** Rp 1.8 - 2.2 juta
- **Ukuran:** 80mm
- **Interface:** USB
- **Kecepatan:** 150mm/detik
- **Keunggulan:** Budget-friendly, compact
- **Support:** ✅ Compatible dengan escpos-usb

### 3. **Xprinter XP-58IIH** (Budget)
- **Harga:** Rp 400 - 600 ribu
- **Ukuran:** 58mm
- **Interface:** USB
- **Kecepatan:** 90mm/detik
- **Keunggulan:** Murah, cocok untuk struk kecil
- **Support:** ✅ Compatible dengan escpos-usb

### 4. **Xprinter XP-80C**
- **Harga:** Rp 700 - 900 ribu
- **Ukuran:** 80mm
- **Interface:** USB
- **Kecepatan:** 150mm/detik
- **Keunggulan:** Budget-friendly, auto-cutter
- **Support:** ✅ Compatible dengan escpos-usb

### 5. **GOWELL 80mm**
- **Harga:** Rp 500 - 700 ribu
- **Ukuran:** 80mm
- **Interface:** USB
- **Kecepatan:** 120mm/detik
- **Keunggulan:** Lokal, mudah service
- **Support:** ✅ Compatible dengan escpos-usb

### 6. **Zjiang ZJ-5890K**
- **Harga:** Rp 600 - 800 ribu
- **Ukuran:** 58mm
- **Interface:** USB
- **Kecepatan:** 90mm/detik
- **Keunggulan:** Compact, hemat kertas
- **Support:** ✅ Compatible dengan escpos-usb

## 📊 Perbandingan

| Printer | Harga | Ukuran | Kecepatan | Rating |
|---------|-------|--------|-----------|--------|
| EPSON TM-T82 | 💰💰💰 | 80mm | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ |
| EPSON TM-T20II | 💰💰 | 80mm | ⚡⚡ | ⭐⭐⭐⭐ |
| Xprinter XP-58IIH | 💰 | 58mm | ⚡ | ⭐⭐⭐ |
| Xprinter XP-80C | 💰 | 80mm | ⚡⚡ | ⭐⭐⭐⭐ |
| GOWELL 80mm | 💰 | 80mm | ⚡ | ⭐⭐⭐ |
| Zjiang ZJ-5890K | 💰 | 58mm | ⚡ | ⭐⭐⭐ |

## 🎯 Rekomendasi Berdasarkan Kebutuhan

### Untuk Bank/Instansi Besar:
**EPSON TM-T82**
- Paling reliable
- Tahan lama (5+ tahun)
- Support bagus
- Cocok untuk volume tinggi (1000+ struk/hari)

### Untuk UMKM/Startup:
**Xprinter XP-80C**
- Balance antara harga dan kualitas
- Auto-cutter
- Cukup untuk 200-500 struk/hari

### Untuk Budget Terbatas:
**Xprinter XP-58IIH**
- Murah
- Cukup untuk antrian sederhana
- Cocok untuk 50-200 struk/hari

### Untuk Volume Tinggi:
**EPSON TM-T82** atau **TM-T20II**
- Tahan print ribuan struk/hari
- Jarang macet
- Spare part mudah

## ⚙️ Spesifikasi Minimum

Printer harus support:
- ✅ **ESC/POS Command** (semua printer thermal modern support)
- ✅ **USB Interface** (untuk koneksi ke server)
- ✅ **Auto-cutter** (opsional, tapi recommended)
- ✅ **58mm atau 80mm** paper width

## 🔌 Cara Setup Printer

### 1. Colok USB ke Server
```bash
# Pastikan printer terdeteksi
lsusb  # Linux
# atau cek Device Manager di Windows
```

### 2. Install Dependencies (Sudah Terinstall)
```bash
cd app
npm install escpos escpos-usb
```

### 3. Konfigurasi di Admin Panel
1. Login sebagai admin
2. Buka menu **Pengaturan Printer**
3. Isi form:
   - Judul: Nama perusahaan
   - Alamat: Alamat lengkap
   - Footer: Catatan (opsional)
   - Ukuran Kertas: 58mm atau 80mm
4. Centang **"Gunakan USB Print Otomatis"**
5. Klik **"Simpan Pengaturan"**

### 4. Test Print
1. Klik tombol **"Test Print"**
2. Jika berhasil, printer akan print struk test
3. Jika gagal, cek:
   - Printer sudah ON
   - Kabel USB terhubung
   - Kertas thermal tersedia

## 🔄 Troubleshooting

### Printer Tidak Terdeteksi
```bash
# Cek USB devices
lsusb

# Cek permissions (Linux)
sudo chmod 666 /dev/usb/lp0
```

### Error "Cannot open device"
- Pastikan printer tidak digunakan aplikasi lain
- Restart aplikasi Node.js
- Cabut-colok USB printer

### Print Tidak Keluar
- Cek kertas thermal sudah terpasang
- Cek printer tidak paper jam
- Restart printer

### Struk Terpotong
- Sesuaikan ukuran kertas di settings (58mm/80mm)
- Cek paper width di printer

## 💡 Tips Pembelian

1. **Pilih 80mm** untuk struk lebih jelas dan profesional
2. **Pilih 58mm** untuk hemat kertas dan space
3. **Pastikan ada auto-cutter** untuk efisiensi
4. **Beli dari toko resmi** yang ada garansi
5. **Cek review** di marketplace sebelum beli
6. **Test dulu** sebelum beli banyak unit

## 🛒 Tempat Beli

### Online:
- Tokopedia: Cari "printer thermal 80mm"
- Shopee: Cari "thermal printer pos"
- Bukalapak: Cari "printer kasir thermal"

### Offline:
- Toko komputer lokal
- Distributor printer (EPSON, Xprinter)
- Toko POS system

## 📦 Paket Lengkap

Saat beli printer, pastikan dapat:
- ✅ Printer unit
- ✅ Power adapter
- ✅ USB cable
- ✅ Roll kertas thermal (1-2 roll)
- ✅ CD driver (opsional, tidak perlu untuk Linux)
- ✅ Buku manual
- ✅ Kartu garansi

## 🔧 Maintenance

### Harian:
- Bersihkan debu di sekitar printer
- Cek kertas thermal cukup

### Mingguan:
- Bersihkan print head dengan alkohol
- Cek kabel USB tidak longgar

### Bulanan:
- Bersihkan roller dengan kain lembut
- Cek auto-cutter masih tajam

## ✅ Kesimpulan

Semua printer di atas **100% compatible** dengan aplikasi ini karena menggunakan standard **ESC/POS protocol** melalui library **escpos-usb**.

**Rekomendasi Top 3:**
1. **EPSON TM-T82** - Best quality
2. **Xprinter XP-80C** - Best value
3. **Xprinter XP-58IIH** - Best budget

Pilih sesuai budget dan kebutuhan volume print Anda!
