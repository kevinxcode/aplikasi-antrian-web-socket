# Panduan User Role & Fitur

## 📋 Daftar Role

Sistem antrian ini memiliki 3 role utama:

### 1. Admin
**Username default:** `admin`  
**Password default:** `admin123`

**Akses & Fitur:**
- ✅ Dashboard lengkap dengan semua counter (CS1, CS2, Teller1, Teller2)
- ✅ Panggil antrian ke semua counter
- ✅ Panggil ulang nomor ke semua counter
- ✅ Reset semua antrian
- ✅ **Export data transaksi ke CSV** dengan filter:
  - Filter berdasarkan tanggal (mulai - akhir)
  - Filter berdasarkan counter (CS1, CS2, Teller1, Teller2)
  - Filter berdasarkan tipe (CS atau Teller)
- ✅ **Manajemen User:**
  - Tambah user baru (username, password, nama lengkap, role)
  - Lihat daftar semua user
  - Hapus user
- ✅ Pengaturan display (marquee text, slide images)

**URL Akses:** `http://localhost:3000/admin`

---

### 2. CS (Customer Service)
**Username default:** `cs1` atau `cs2`  
**Password default:** `cs123`

**Akses & Fitur:**
- ✅ Dashboard khusus untuk counter masing-masing
- ✅ Panggil antrian CS berikutnya (hanya untuk counter sendiri)
- ✅ Panggil ulang nomor CS (hanya untuk counter sendiri)
- ✅ Lihat daftar antrian CS yang menunggu
- ❌ Tidak bisa akses counter Teller
- ❌ Tidak bisa reset antrian
- ❌ Tidak bisa export data
- ❌ Tidak bisa manajemen user

**URL Akses:**
- CS1: `http://localhost:3000/cs1`
- CS2: `http://localhost:3000/cs2`

**Auto Redirect:** Setelah login, user `cs1` otomatis ke `/cs1`, user `cs2` ke `/cs2`

---

### 3. Teller
**Username default:** `teller1` atau `teller2`  
**Password default:** `teller123`

**Akses & Fitur:**
- ✅ Dashboard khusus untuk counter masing-masing
- ✅ Panggil antrian Teller berikutnya (hanya untuk counter sendiri)
- ✅ Panggil ulang nomor Teller (hanya untuk counter sendiri)
- ✅ Lihat daftar antrian Teller yang menunggu
- ❌ Tidak bisa akses counter CS
- ❌ Tidak bisa reset antrian
- ❌ Tidak bisa export data
- ❌ Tidak bisa manajemen user

**URL Akses:**
- Teller1: `http://localhost:3000/teller1`
- Teller2: `http://localhost:3000/teller2`

**Auto Redirect:** Setelah login, user `teller1` otomatis ke `/teller1`, user `teller2` ke `/teller2`

---

## 🔐 Cara Login

1. Buka `http://localhost:3000`
2. Masukkan username dan password
3. Sistem akan otomatis redirect ke halaman sesuai role:
   - **Admin** → `/admin` (dashboard lengkap)
   - **CS1** → `/cs1` (counter CS 1)
   - **CS2** → `/cs2` (counter CS 2)
   - **Teller1** → `/teller1` (counter Teller 1)
   - **Teller2** → `/teller2` (counter Teller 2)

---

## 👥 Manajemen User (Admin Only)

### Menambah User Baru

1. Login sebagai admin
2. Klik menu **"Manajemen User"**
3. Isi form:
   - **Username:** Username untuk login (harus unik)
   - **Password:** Password untuk login
   - **Nama Lengkap:** Nama lengkap user (opsional)
   - **Role:** Pilih role (admin, cs, atau teller)
4. Klik **"Tambah User"**

### Menghapus User

1. Login sebagai admin
2. Klik menu **"Manajemen User"**
3. Pada tabel user, klik tombol **"Hapus"** di user yang ingin dihapus
4. Konfirmasi penghapusan

**Catatan:** Admin tidak bisa menghapus user sendiri yang sedang login

---

## 📊 Export Data Transaksi (Admin Only)

### Cara Export

1. Login sebagai admin
2. Scroll ke bagian **"Export Data Transaksi"**
3. Pilih filter (opsional):
   - **Tanggal Mulai:** Tanggal awal transaksi
   - **Tanggal Akhir:** Tanggal akhir transaksi
   - **Counter:** Filter berdasarkan counter tertentu
   - **Tipe:** Filter berdasarkan tipe (CS atau Teller)
4. Klik **"📥 Export ke CSV"**
5. File CSV akan otomatis terdownload

### Format CSV

File CSV berisi kolom:
- Nomor Antrian (A001, B001, dll)
- Tipe (cs atau teller)
- Nama Customer
- Counter (cs1, cs2, t1, t2)
- Status (waiting, called)
- Dipanggil Oleh (nama petugas)
- Waktu Dibuat
- Waktu Dipanggil

---

## 🎯 Perbedaan Antrian CS vs Teller

### Antrian CS
- **Prefix:** A (A001, A002, A003, ...)
- **Counter:** CS 1 dan CS 2
- **Warna:** Hijau
- **Untuk:** Layanan Customer Service

### Antrian Teller
- **Prefix:** B (B001, B002, B003, ...)
- **Counter:** Teller 1 dan Teller 2
- **Warna:** Biru
- **Untuk:** Layanan Teller/Kasir

---

## 🔄 Alur Kerja

### 1. Customer Ambil Nomor
- Buka `/ambil-nomor.html`
- Pilih tipe layanan (CS atau Teller)
- Masukkan nama (opsional)
- Klik "Ambil Nomor Antrian"
- Nomor akan masuk ke antrian

### 2. Petugas Panggil Antrian
- Login sesuai role (cs1, cs2, teller1, teller2)
- Klik "📢 Panggil Antrian Berikutnya"
- Nomor akan muncul di display screen
- Data tersimpan di database

### 3. Display Screen
- Buka `/display` di TV/Monitor
- Menampilkan nomor yang dipanggil
- Menampilkan counter tujuan
- Auto-refresh real-time via WebSocket

### 4. Admin Export Data
- Login sebagai admin
- Pilih filter periode/counter
- Export ke CSV
- Analisa data transaksi

---

## 🛡️ Keamanan

- Password di-hash menggunakan bcrypt
- Session-based authentication
- Role-based access control (RBAC)
- Middleware untuk proteksi route
- Validasi input di backend

---

## 📝 Database Schema

### Tabel: users
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- password (VARCHAR - hashed)
- role (VARCHAR: admin, cs, teller)
- full_name (VARCHAR)
- created_at (TIMESTAMP)
```

### Tabel: queue_transactions
```sql
- id (SERIAL PRIMARY KEY)
- queue_number (VARCHAR: A001, B001)
- queue_type (VARCHAR: cs, teller)
- customer_name (VARCHAR)
- counter (VARCHAR: cs1, cs2, t1, t2)
- status (VARCHAR: waiting, called)
- called_by (INTEGER - user id)
- called_by_name (VARCHAR)
- created_at (TIMESTAMP)
- called_at (TIMESTAMP)
```

---

## 🚀 API Endpoints Baru

### User Management (Admin Only)

**GET /api/users**
- Mendapatkan daftar semua user
- Response: `{ success: true, users: [...] }`

**POST /api/add-user**
- Menambah user baru
- Body: `{ username, password, role, full_name }`
- Response: `{ success: true, message: "..." }`

**POST /api/delete-user**
- Menghapus user
- Body: `{ userId }`
- Response: `{ success: true, message: "..." }`

### Export Data (Admin Only)

**GET /api/export-transactions**
- Export transaksi ke CSV
- Query params: `startDate, endDate, counter, type`
- Response: File CSV

**GET /api/transactions**
- Mendapatkan data transaksi dengan filter
- Query params: `startDate, endDate, counter, type`
- Response: `{ success: true, transactions: [...] }`

---

## 💡 Tips Penggunaan

1. **Untuk Admin:**
   - Export data secara berkala untuk backup
   - Monitor aktivitas melalui data transaksi
   - Kelola user sesuai kebutuhan operasional

2. **Untuk CS/Teller:**
   - Fokus pada counter masing-masing
   - Gunakan fitur panggil ulang jika customer tidak hadir
   - Pastikan nama lengkap sudah diisi saat pertama login

3. **Untuk Display:**
   - Gunakan TV/Monitor terpisah
   - Set browser ke fullscreen mode (F11)
   - Pastikan koneksi internet stabil untuk WebSocket

---

## 🔧 Troubleshooting

### User tidak bisa login
- Cek username dan password
- Pastikan user sudah terdaftar di database
- Cek role user sudah sesuai

### Export CSV kosong
- Pastikan ada data transaksi di periode yang dipilih
- Cek filter yang digunakan
- Cek koneksi database

### Counter tidak bisa panggil antrian
- Pastikan ada antrian yang menunggu
- Cek role user sesuai dengan tipe antrian
- Refresh halaman dan coba lagi

---

## 📞 Support

Untuk pertanyaan atau masalah, hubungi administrator sistem.
