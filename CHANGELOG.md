# Changelog - Sistem Antrian

## [v2.0.0] - Update Role-Based System & Export Data

### ✨ Fitur Baru

#### 1. Sistem Role & Authentication
- **3 Role berbeda:** Admin, CS, Teller
- **Auto-redirect** setelah login sesuai username:
  - `admin` → `/admin`
  - `cs1` → `/cs1`
  - `cs2` → `/cs2`
  - `teller1` → `/teller1`
  - `teller2` → `/teller2`
- **Role-based access control** dengan middleware
- **Session management** untuk keamanan

#### 2. Halaman Counter Khusus
- **Counter CS1 & CS2:** `/cs1` dan `/cs2`
  - Interface sederhana dan fokus
  - Hanya bisa panggil antrian CS (prefix A)
  - Lihat daftar antrian CS
  - Panggil ulang nomor CS
- **Counter Teller1 & Teller2:** `/teller1` dan `/teller2`
  - Interface sederhana dan fokus
  - Hanya bisa panggil antrian Teller (prefix B)
  - Lihat daftar antrian Teller
  - Panggil ulang nomor Teller

#### 3. Manajemen User (Admin Only)
- **Halaman baru:** `/users`
- **Fitur:**
  - Tambah user baru dengan form:
    - Username (harus unik)
    - Password (auto-hashed dengan bcrypt)
    - Nama Lengkap (opsional)
    - Role (admin/cs/teller)
  - Lihat daftar semua user
  - Hapus user (tidak bisa hapus diri sendiri)
  - Badge warna untuk setiap role

#### 4. Export Data Transaksi (Admin Only)
- **Export ke CSV** dengan fitur:
  - Filter berdasarkan tanggal (mulai - akhir)
  - Filter berdasarkan counter (cs1, cs2, t1, t2)
  - Filter berdasarkan tipe (cs atau teller)
  - Auto-download file CSV
- **Format CSV lengkap:**
  - Nomor Antrian
  - Tipe (cs/teller)
  - Nama Customer
  - Counter
  - Status
  - Dipanggil Oleh
  - Waktu Dibuat
  - Waktu Dipanggil

#### 5. Pemisahan Antrian CS & Teller
- **Antrian CS:**
  - Prefix: A (A001, A002, A003, ...)
  - Counter: CS1 dan CS2
  - Warna: Hijau
- **Antrian Teller:**
  - Prefix: B (B001, B002, B003, ...)
  - Counter: Teller1 dan Teller2
  - Warna: Biru

### 🔧 Perubahan Backend

#### API Endpoints Baru
1. **User Management:**
   - `GET /api/users` - Get all users (admin only)
   - `POST /api/add-user` - Add new user (admin only)
   - `POST /api/delete-user` - Delete user (admin only)

2. **Export Data:**
   - `GET /api/export-transactions` - Export to CSV (admin only)
   - `GET /api/transactions` - Get transactions with filter (admin only)

3. **Routes:**
   - `GET /users` - User management page (admin only)
   - `GET /cs1` - CS1 counter page (cs only)
   - `GET /cs2` - CS2 counter page (cs only)
   - `GET /teller1` - Teller1 counter page (teller only)
   - `GET /teller2` - Teller2 counter page (teller only)

#### Database Changes
- **users table:** Sudah ada, ditambahkan default users
- **queue_transactions table:** 
  - Menyimpan semua transaksi antrian
  - Tracking siapa yang memanggil (called_by, called_by_name)
  - Timestamp lengkap (created_at, called_at)

#### Middleware & Security
- `requireAuth()` - Cek user sudah login
- `requireRole(...roles)` - Cek role user
- Password hashing dengan bcrypt (10 rounds)
- Session-based authentication
- Input validation

### 🎨 Perubahan Frontend

#### File Baru
1. **counter.html** - Halaman counter untuk CS & Teller
   - UI modern dengan gradient
   - Display nomor besar
   - Info antrian menunggu
   - Form panggil ulang
   - Daftar antrian real-time

2. **users.html** - Halaman manajemen user
   - Form tambah user
   - Tabel daftar user
   - Badge role dengan warna
   - Tombol hapus user

#### File Diupdate
1. **admin.html**
   - Tambah section export data dengan filter
   - Link ke halaman manajemen user
   - Tampilkan 4 counter (cs1, cs2, t1, t2)
   - Adjust UI berdasarkan role

2. **login.html**
   - Info default users
   - Redirect berdasarkan role

3. **index.js (backend)**
   - Routing baru untuk counter pages
   - API user management
   - API export data
   - Logic pemisahan antrian CS & Teller
   - Auto-redirect setelah login

### 📚 Dokumentasi Baru

1. **ROLES-GUIDE.md**
   - Panduan lengkap untuk setiap role
   - Cara login dan akses
   - Fitur per role
   - Cara manajemen user
   - Cara export data
   - Troubleshooting

2. **CHANGELOG.md** (file ini)
   - Daftar perubahan lengkap
   - Fitur baru
   - Breaking changes

3. **README.md** (updated)
   - Update fitur list
   - Update cara penggunaan
   - Update API endpoints
   - Tambah info role system

### 🔄 Breaking Changes

1. **Counter naming:**
   - Sebelumnya: `1`, `2`
   - Sekarang: `cs1`, `cs2`, `t1`, `t2`

2. **Queue number format:**
   - Sebelumnya: `001`, `002`, `003`
   - Sekarang: `A001`, `A002` (CS) dan `B001`, `B002` (Teller)

3. **Login redirect:**
   - Sebelumnya: Semua ke `/admin`
   - Sekarang: Berdasarkan role dan username

### 📦 Dependencies

Tidak ada dependency baru. Masih menggunakan:
- express
- socket.io
- bcrypt
- express-session
- pg (PostgreSQL)

### 🚀 Migration Guide

#### Dari v1.x ke v2.0

1. **Database:**
   - Jalankan aplikasi, database akan auto-migrate
   - Default users akan otomatis dibuat

2. **Environment Variables:**
   - Tidak ada perubahan
   - Tetap gunakan DB_HOST, DB_PORT, dll

3. **Docker:**
   - Tidak ada perubahan
   - Tetap gunakan `docker-compose up -d`

4. **Existing Data:**
   - Data antrian lama akan tetap ada
   - Perlu update format nomor manual jika perlu

### 🐛 Bug Fixes

- Fix role permission check di next-queue
- Fix recall number validation
- Fix session management
- Fix WebSocket update untuk multiple counters

### 🎯 Next Features (Planned)

- [ ] Dashboard analytics untuk admin
- [ ] Report PDF generation
- [ ] Email notification
- [ ] SMS integration
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app

### 👥 Contributors

- System Developer

### 📝 Notes

- Pastikan PostgreSQL sudah running
- Default users akan otomatis dibuat saat pertama kali run
- Untuk production, ganti semua default password
- Backup database secara berkala

---

**Full Changelog:** v1.0.0...v2.0.0
