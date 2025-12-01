# Sistem Antrian dengan WebSocket

Aplikasi Node.js untuk sistem antrian real-time menggunakan WebSocket dengan 2 counter (loket).

## 📋 Fitur

### Fitur Umum
- ✅ Tambah antrian baru dengan nama (opsional)
- ✅ 4 Counter/Loket terpisah (CS1, CS2, Teller1, Teller2)
- ✅ 2 Tipe antrian (CS dan Teller)
- ✅ Panggil antrian berikutnya per loket
- ✅ Panggil ulang nomor antrian tertentu
- ✅ Display real-time untuk nomor yang dipanggil
- ✅ Update otomatis menggunakan WebSocket
- ✅ Format nomor dengan prefix (A001 untuk CS, B001 untuk Teller)
- ✅ Database PostgreSQL untuk persistensi data

### Fitur Admin
- ✅ Dashboard lengkap semua counter
- ✅ **Export data transaksi ke CSV** dengan filter
- ✅ **Manajemen User** (tambah, hapus, lihat)
- ✅ Reset antrian
- ✅ Pengaturan display (marquee, slide images)

### Fitur CS & Teller
- ✅ Dashboard khusus per counter
- ✅ Hanya bisa panggil antrian sesuai role
- ✅ Interface sederhana dan fokus

### Sistem Role
- ✅ **Admin:** Akses penuh, export data, manajemen user
- ✅ **CS1/CS2:** Hanya counter CS masing-masing
- ✅ **Teller1/Teller2:** Hanya counter Teller masing-masing
- ✅ Authentication & Authorization
- ✅ Session management

## 🚀 Cara Menjalankan

### Opsi 1: Tanpa Docker (Manual)

**Prasyarat:**
- Node.js 18+ sudah terinstall

**Langkah:**
```bash
# 1. Masuk ke folder app
cd app

# 2. Install dependencies
npm install

# 3. Jalankan aplikasi
npm start
```

**Atau dari root folder:**
```bash
npm start
```

### Opsi 2: Dengan Docker (Recommended)

**Prasyarat:**
- Docker dan Docker Compose sudah terinstall

**Langkah:**
```bash
# Build dan jalankan container
docker-compose up -d --build

# Lihat logs
docker-compose logs -f

# Stop aplikasi
docker-compose down
```

**Atau menggunakan npm script:**
```bash
npm run docker:up      # Start aplikasi
npm run docker:logs    # Lihat logs
npm run docker:down    # Stop aplikasi
```

## 🌐 Akses Aplikasi

Setelah aplikasi berjalan, buka browser:

### Login & Dashboard
- **Login**: http://localhost:3000/login
- **Admin Dashboard**: http://localhost:3000/admin (setelah login sebagai admin)
- **CS1 Counter**: http://localhost:3000/cs1 (setelah login sebagai cs1)
- **CS2 Counter**: http://localhost:3000/cs2 (setelah login sebagai cs2)
- **Teller1 Counter**: http://localhost:3000/teller1 (setelah login sebagai teller1)
- **Teller2 Counter**: http://localhost:3000/teller2 (setelah login sebagai teller2)

### Public Pages
- **Ambil Nomor**: http://localhost:3000/ambil-nomor.html
- **Display Screen**: http://localhost:3000/display

### Default Login
- **Admin**: username: `admin`, password: `admin123`
- **CS**: username: `cs1` atau `cs2`, password: `cs123`
- **Teller**: username: `teller1` atau `teller2`, password: `teller123`

Jika deploy di server, ganti `localhost` dengan IP server Anda.

## 📁 Struktur Folder

```
1.antrial-app/
├── docker-compose.yml          # Konfigurasi Docker Compose
├── package.json                # NPM scripts untuk root
├── README.md                   # Dokumentasi utama
├── DEPLOY.md                   # Panduan deploy ke server
└── app/                        # Folder aplikasi
    ├── index.js                # Server utama
    ├── package.json            # Dependencies aplikasi
    ├── Dockerfile              # Docker image config
    ├── .dockerignore           # File yang diabaikan Docker
    └── public/                 # File HTML
        ├── index.html          # Admin panel
        └── display.html        # Display screen
```

## 🎯 Cara Penggunaan

### 1. Login
1. Buka http://localhost:3000
2. Masukkan username dan password
3. Sistem akan redirect otomatis sesuai role

### 2. Admin Panel

**Dashboard:**
- Lihat semua counter (CS1, CS2, Teller1, Teller2)
- Panggil antrian ke counter manapun
- Panggil ulang nomor ke counter manapun
- Reset semua antrian

**Export Data:**
1. Scroll ke bagian "Export Data Transaksi"
2. Pilih filter (tanggal, counter, tipe)
3. Klik "Export ke CSV"
4. File akan terdownload otomatis

**Manajemen User:**
1. Klik menu "Manajemen User"
2. Isi form untuk tambah user baru:
   - Username (harus unik)
   - Password
   - Nama Lengkap (opsional)
   - Role (admin/cs/teller)
3. Klik "Tambah User"
4. User baru bisa langsung login

### 3. CS Counter (CS1/CS2)
1. Login dengan username cs1 atau cs2
2. Otomatis masuk ke counter masing-masing
3. Klik "Panggil Antrian Berikutnya" untuk panggil antrian CS
4. Masukkan nomor untuk panggil ulang
5. Hanya bisa akses antrian CS

### 4. Teller Counter (Teller1/Teller2)
1. Login dengan username teller1 atau teller2
2. Otomatis masuk ke counter masing-masing
3. Klik "Panggil Antrian Berikutnya" untuk panggil antrian Teller
4. Masukkan nomor untuk panggil ulang
5. Hanya bisa akses antrian Teller

### 5. Ambil Nomor (Public)
1. Buka /ambil-nomor.html
2. Pilih tipe layanan (CS atau Teller)
3. Masukkan nama (opsional)
4. Klik "Ambil Nomor"
5. Nomor akan masuk ke antrian

### 6. Display Screen (Public)
- Tampilkan di TV/Monitor terpisah
- Menampilkan nomor yang dipanggil real-time
- Menampilkan counter tujuan
- Menampilkan status semua counter
- Auto-update via WebSocket

## 🔌 API Endpoints

### Authentication

**POST /api/login**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**POST /api/logout**

**GET /api/user**

### Queue Management

**POST /api/add-queue**
```json
{
  "type": "cs",  // atau "teller"
  "name": "John Doe"  // opsional
}
```

**POST /api/next-queue**
```json
{
  "counter": "cs1"  // cs1, cs2, t1, t2
}
```

**POST /api/recall-number**
```json
{
  "number": "A003",
  "counter": "cs1"
}
```

**POST /api/reset-queue** (Admin only)

**GET /api/queue-status**

### User Management (Admin only)

**GET /api/users**

**POST /api/add-user**
```json
{
  "username": "cs3",
  "password": "password123",
  "full_name": "Customer Service 3",
  "role": "cs"
}
```

**POST /api/delete-user**
```json
{
  "userId": 5
}
```

### Export Data (Admin only)

**GET /api/export-transactions?startDate=2024-01-01&endDate=2024-12-31&counter=cs1&type=cs**

**GET /api/transactions?startDate=2024-01-01&endDate=2024-12-31**

### Display Settings (Admin only)

**GET /api/display-settings**

**POST /api/display-settings**
```json
{
  "marquee_text": "Selamat Datang",
  "slide_images": []
}
```

## 🔄 WebSocket Events

### Event: queueUpdated
Dikirim setiap ada perubahan pada antrian

**Data:**
```json
{
  "queue": [...],
  "counters": {
    "1": { "current": "001", "name": "Loket 1" },
    "2": { "current": "000", "name": "Loket 2" }
  },
  "total": 5,
  "called": {
    "number": "001",
    "counter": 1,
    "recall": false
  }
}
```

## 🐳 Docker Commands

```bash
# Build dan start
docker-compose up -d --build

# Stop
docker-compose down

# Restart
docker-compose restart

# Lihat logs
docker-compose logs -f

# Lihat status
docker-compose ps

# Stop dan hapus semua
docker-compose down --rmi all -v
```

## 🛠️ Troubleshooting

### Port 3000 sudah digunakan

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Ganti 8080 dengan port yang diinginkan
```

### Permission denied saat npm install

Pastikan Node.js sudah terinstall:
```bash
node -v
npm -v
```

Jika belum, install Node.js atau gunakan Docker.

### WebSocket tidak connect

Pastikan firewall tidak memblokir port 3000:
```bash
sudo ufw allow 3000
```

### Container error

Lihat logs detail:
```bash
docker-compose logs
```

## 📦 Deploy ke Production

Lihat file [DEPLOY.md](DEPLOY.md) untuk panduan lengkap deploy ke Ubuntu server dengan:
- Docker Compose
- Nginx Reverse Proxy
- SSL/HTTPS
- Auto-restart

## 🔧 Teknologi

- **Backend**: Node.js + Express.js
- **Real-time**: Socket.IO (WebSocket)
- **Frontend**: HTML5 + Vanilla JavaScript
- **Container**: Docker + Docker Compose

## 📝 License

MIT License

## 👨‍💻 Author

Dibuat untuk sistem antrian dengan 2 counter/loket yang dapat berjalan secara real-time.