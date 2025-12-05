# 🔒 Cara Proteksi Source Code

## Sistem Proteksi yang Sudah Dibuat

### 1. File Integrity Check
Sistem monitoring yang mendeteksi perubahan file secara otomatis.

### 2. File Permission Protection
Mengatur file menjadi read-only dan membatasi akses modifikasi.

---

## 📋 Cara Menggunakan

### Aktifkan Proteksi (Jalankan Sekali)

**CMD (Recommended - Password tersembunyi):**
```cmd
protect-files.bat
```

**PowerShell (Password terlihat):**
```powershell
.\protect-files.bat
```

**Password default:** `mypassword123`

### Verifikasi File (Cek Integritas)

```cmd
cd app
npm run verify
```

### Nonaktifkan Proteksi (Jika Anda Ingin Edit)

**CMD (Recommended):**
```cmd
unprotect-files.bat
```

**PowerShell:**
```powershell
.\unprotect-files.bat
```

**Password default:** `mypassword123`

### Ganti Password

```cmd
.\change-password.bat
```

---

## 🛡️ Apa yang Dilindungi?

File yang diproteksi:
- ✅ `index.js` - Server utama
- ✅ `db.js` - Database config
- ✅ `print_api.php` - Print API
- ✅ `public/admin.html` - Admin panel
- ✅ `public/login.html` - Login page

---

## ⚙️ Cara Kerja

### 1. Hash Generation
Saat proteksi diaktifkan, sistem membuat hash (sidik jari digital) dari setiap file.

### 2. Integrity Check
Setiap kali aplikasi dijalankan, sistem membandingkan hash file saat ini dengan hash asli.

### 3. Auto Block
Jika ada perubahan tidak sah, aplikasi akan **BERHENTI** dan menampilkan error.

---

## 🔧 Workflow Anda

### Saat Deploy ke Client:
1. Jalankan `protect-files.bat`
2. File akan terlindungi
3. Hanya Anda yang bisa edit (dengan unprotect dulu)

### Saat Anda Ingin Edit:
1. Jalankan `unprotect-files.bat`
2. Edit file
3. Jalankan `protect-files.bat` lagi

---

## 📝 Tambahan File yang Ingin Diproteksi

Edit file `app/integrity-check.js`:

```javascript
const protectedFiles = {
  'index.js': '',
  'db.js': '',
  'print_api.php': '',
  'public/admin.html': '',
  'public/login.html': '',
  'public/counter.html': '',  // Tambahkan file baru
  'public/display.html': ''    // Tambahkan file baru
};
```

Lalu jalankan `npm run protect` lagi.

---

## ⚠️ Catatan Penting

1. **Password default:** `admin123` - GANTI SEGERA!
2. **Ganti password:** Jalankan `change-password.bat`
3. **Backup file-hashes.json** - File ini berisi hash asli
4. **Jangan commit password-config.js ke Git**
5. **Test dulu** sebelum deploy ke production

---

## 🚨 Troubleshooting

### Error: "Hash file not found"
```cmd
cd app
npm run protect
```

### Error: "File has been modified"
Artinya ada yang mengubah file tanpa izin. Cek file mana yang berubah.

### Tidak Bisa Edit File
```cmd
unprotect-files.bat
```

---

## 🔐 Proteksi Tambahan (Opsional)

### 1. Enkripsi dengan ionCube (PHP)
Untuk file PHP, gunakan ionCube encoder.

### 2. Obfuscation (JavaScript)
Gunakan tools seperti javascript-obfuscator.

### 3. Git Hooks
Tambahkan pre-commit hook untuk validasi.

---

## 📞 Support

Jika ada masalah, hubungi developer atau cek log error di `app/error.log`
