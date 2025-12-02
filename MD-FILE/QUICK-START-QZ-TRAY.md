# Quick Start - QZ Tray Print Otomatis

Panduan cepat 5 menit untuk setup print otomatis dengan QZ Tray.

## 🚀 Langkah Cepat

### 1️⃣ Download QZ Tray (2 menit)
```
https://qz.io/download/
```
- Pilih versi Windows/Linux/macOS
- Download dan install
- Jalankan QZ Tray (icon muncul di system tray)

### 2️⃣ Cek Nama Printer (30 detik)

**Auto-Detect (Mudah!):**
- Nanti klik tombol **"🔍 Deteksi Printer"** di admin panel
- Pilih printer dari daftar
- Selesai!

**Manual (Opsional):**
- Windows: `Control Panel` → `Devices and Printers`
- Linux/macOS: `lpstat -p -d`

### 3️⃣ Konfigurasi di Admin Panel (2 menit)

1. Login: http://localhost:3000
   - Username: `admin`
   - Password: `admin123`

2. Klik **"Pengaturan Printer"**

3. Isi form:
   ```
   Judul: BTN Syariah
   Alamat: Jl. Sopo Del No 56 Jakarta Selatan
   Ukuran Kertas: 58mm
   ✅ Gunakan QZ Tray untuk Print Otomatis
   ```

4. Klik **"🔍 Deteksi Printer"**
   - **Jika muncul prompt:** Klik **"Always Allow"** ✅
   - Daftar printer muncul
   - Klik printer yang ingin digunakan
   - Nama otomatis terisi!

5. Klik **"💾 Simpan Pengaturan"**

6. Klik **"🖨️ Test Print"**
   - Jika berhasil → Printer langsung print ✅
   - Jika gagal → Lihat troubleshooting di bawah ❌

### 4️⃣ Test Ambil Nomor (10 detik)

1. Buka: http://localhost:3000/ambil-nomor.html
2. Klik **"Customer Service"** atau **"Teller Service"**
3. Printer langsung print otomatis! 🎉

## ✅ Checklist

- [ ] QZ Tray terinstall dan berjalan
- [ ] Printer thermal terinstall dan online
- [ ] Nama printer sudah dicatat (case-sensitive!)
- [ ] Konfigurasi di admin panel sudah disimpan
- [ ] Test print berhasil
- [ ] Ambil nomor langsung print

## ❌ Troubleshooting Cepat

### Muncul "Anonymous request wants to access printer"?

**Solusi:** Klik **"Always Allow"**
- Ini security prompt dari QZ Tray
- Hanya muncul 1x pertama kali
- Setelah allow, tidak muncul lagi
- Detail: [QZ-TRAY-SECURITY.md](QZ-TRAY-SECURITY.md)

### Printer tidak print?

**1. Cek QZ Tray berjalan:**
- Lihat icon QZ Tray di system tray
- Warna hijau = aktif ✅
- Warna merah = tidak aktif ❌

**2. Cek nama printer:**
- Gunakan tombol **"🔍 Deteksi Printer"** untuk auto-detect
- Atau pastikan nama PERSIS sama (case-sensitive!)
- `POS-58` ≠ `pos-58` ≠ `POS 58`

**3. Cek printer online:**
- Test print dari Notepad
- Pastikan kertas tidak habis
- Pastikan printer tidak error

**4. Restart QZ Tray:**
- Right-click icon QZ Tray → Exit
- Jalankan QZ Tray lagi

### Masih gagal?

**Fallback ke Browser Print:**
1. Login admin
2. Pengaturan Printer
3. **Uncheck** "Gunakan QZ Tray"
4. Simpan
5. Sekarang pakai Ctrl+P (browser print)

## 📊 Perbandingan

| Mode | Klik | Dialog | Speed |
|------|------|--------|-------|
| Browser Print | 2x | Ada | Lambat |
| QZ Tray | 1x | Tidak ada | Cepat ⚡ |

## 💡 Tips

1. **Auto-start QZ Tray:**
   - Windows: Copy shortcut ke Startup folder
   - Lokasi: `shell:startup`

2. **Backup konfigurasi:**
   - Screenshot pengaturan printer
   - Catat nama printer yang berhasil

3. **Test dulu sebelum produksi:**
   - Test print 5-10 kali
   - Pastikan format sudah benar
   - Cek semua data tercetak

## 🆘 Butuh Bantuan?

- **Dokumentasi lengkap:** [QZ-TRAY-SETUP.md](QZ-TRAY-SETUP.md)
- **QZ Tray Demo:** https://demo.qz.io/
- **QZ Tray Docs:** https://qz.io/wiki/

## 🎯 Next Steps

Setelah QZ Tray berjalan:
- [ ] Setup auto-start QZ Tray
- [ ] Test dengan volume tinggi
- [ ] Train user untuk monitor QZ Tray
- [ ] Backup konfigurasi

---

**Selamat! Print otomatis sudah aktif! 🎉**
