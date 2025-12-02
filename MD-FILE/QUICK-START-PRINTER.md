# Quick Start - Printer Thermal 58mm

Panduan cepat untuk mulai menggunakan printer thermal dalam 5 menit! ⚡

## 🚀 Langkah Cepat

### 1. Install Dependencies (1 menit)

```bash
cd app
npm install
```

### 2. Hubungkan Printer (30 detik)

- Colokkan printer thermal 58mm ke USB
- Nyalakan printer
- Tunggu Windows mendeteksi

### 3. Test Printer (30 detik)

```bash
node test-printer.js
```

**Output yang diharapkan:**
```
✅ Ditemukan 1 printer
🖨️  Memulai test print...
✅ Printer berhasil dibuka!
📄 Mencetak struk test...
✅ Print berhasil!
```

Jika berhasil, struk test akan keluar dari printer! 🎉

### 4. Jalankan Aplikasi (30 detik)

```bash
npm start
```

### 5. Setup Pengaturan (2 menit)

1. Buka browser: `http://localhost:3000`
2. Login sebagai admin (username: `admin`, password: `admin123`)
3. Klik menu **"Pengaturan Printer"**
4. Isi form:
   - **Judul**: BTN Syariah
   - **Alamat**: Jl. Sopo Del No 56 Jakarta Selatan
   - **Footer**: Terima kasih atas kunjungan Anda
5. Klik **"Test Print"** untuk coba
6. Klik **"Simpan Pengaturan"**

### 6. Test Ambil Nomor (1 menit)

1. Buka: `http://localhost:3000/ambil-nomor.html`
2. Klik tombol **"Customer Service"** atau **"Teller Service"**
3. **Printer otomatis cetak struk!** 🖨️
4. Cek struk yang keluar

## ✅ Selesai!

Sistem sudah siap digunakan dengan printer thermal! 🎊

## 🐛 Troubleshooting Cepat

### Printer Tidak Terdeteksi?

```bash
# Cek printer USB
node -e "const usb = require('escpos-usb'); console.log(usb.USB.findPrinter());"
```

**Solusi:**
- Coba port USB lain
- Restart printer
- Restart komputer

### Error LIBUSB_ERROR_ACCESS (Windows)?

**Solusi cepat:**
1. Download Zadig: https://zadig.akeo.ie/
2. Jalankan Zadig
3. Pilih printer → Install WinUSB driver
4. Restart aplikasi

### Print Tidak Keluar?

**Checklist:**
- ✅ Printer menyala?
- ✅ Kertas thermal ada?
- ✅ Kabel USB terpasang?
- ✅ Test print berhasil?

## 📋 Format Struk

Struk yang dicetak:

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

## 🎯 Tips

1. **Selalu test print** sebelum digunakan customer
2. **Siapkan kertas thermal cadangan**
3. **Bersihkan head printer** setiap minggu
4. **Backup printer** untuk antisipasi

## 📚 Dokumentasi Lengkap

Untuk panduan detail, lihat: [PRINTER-SETUP.md](PRINTER-SETUP.md)

## 🎉 Selamat!

Sistem antrian dengan printer thermal sudah siap digunakan!

---

**Need help?** Cek log error di console atau baca dokumentasi lengkap.
