# Quick Start Guide

## 🚀 Jalankan Aplikasi

```bash
# Opsi 1: Docker (Recommended)
docker-compose up -d

# Opsi 2: Manual
cd app
npm install
npm start
```

## 🔐 Login Default

| Role | Username | Password | URL Setelah Login |
|------|----------|----------|-------------------|
| Admin | `admin` | `admin123` | `/admin` |
| CS 1 | `cs1` | `cs123` | `/cs1` |
| CS 2 | `cs2` | `cs123` | `/cs2` |
| Teller 1 | `teller1` | `teller123` | `/teller1` |
| Teller 2 | `teller2` | `teller123` | `/teller2` |

## 📱 URL Akses

```
Login:          http://localhost:3000/login
Admin:          http://localhost:3000/admin
CS1:            http://localhost:3000/cs1
CS2:            http://localhost:3000/cs2
Teller1:        http://localhost:3000/teller1
Teller2:        http://localhost:3000/teller2
Ambil Nomor:    http://localhost:3000/ambil-nomor.html
Display:        http://localhost:3000/display
Manajemen User: http://localhost:3000/users (admin only)
Settings:       http://localhost:3000/settings (admin only)
```

## 🎯 Fitur Per Role

### Admin
✅ Akses semua counter  
✅ Export data ke CSV  
✅ Manajemen user (tambah/hapus)  
✅ Reset antrian  
✅ Pengaturan display  

### CS (cs1, cs2)
✅ Counter CS masing-masing  
✅ Panggil antrian CS (prefix A)  
✅ Panggil ulang nomor CS  
❌ Tidak bisa akses Teller  

### Teller (teller1, teller2)
✅ Counter Teller masing-masing  
✅ Panggil antrian Teller (prefix B)  
✅ Panggil ulang nomor Teller  
❌ Tidak bisa akses CS  

## 📊 Tipe Antrian

| Tipe | Prefix | Counter | Warna |
|------|--------|---------|-------|
| CS | A001, A002, ... | CS1, CS2 | Hijau |
| Teller | B001, B002, ... | Teller1, Teller2 | Biru |

## 💡 Quick Actions

### Tambah User Baru (Admin)
1. Login sebagai admin
2. Klik "Manajemen User"
3. Isi form → Klik "Tambah User"

### Export Data (Admin)
1. Login sebagai admin
2. Scroll ke "Export Data Transaksi"
3. Pilih filter → Klik "Export ke CSV"

### Panggil Antrian (CS/Teller)
1. Login sesuai role
2. Klik "📢 Panggil Antrian Berikutnya"

### Panggil Ulang
1. Masukkan nomor (contoh: A001)
2. Klik "🔁 Panggil Ulang"

## 🔧 Troubleshooting

**Port 3000 sudah digunakan?**
```yaml
# Edit docker-compose.yml
ports:
  - "8080:3000"
```

**Database error?**
```bash
# Cek PostgreSQL running
docker-compose ps

# Restart
docker-compose restart
```

**WebSocket tidak connect?**
```bash
# Cek firewall
sudo ufw allow 3000
```

## 📚 Dokumentasi Lengkap

- [README.md](README.md) - Dokumentasi utama
- [ROLES-GUIDE.md](ROLES-GUIDE.md) - Panduan role & fitur
- [CHANGELOG.md](CHANGELOG.md) - Daftar perubahan
- [DEPLOY.md](DEPLOY.md) - Panduan deploy production

## 🆘 Need Help?

Baca dokumentasi lengkap di [ROLES-GUIDE.md](ROLES-GUIDE.md)
