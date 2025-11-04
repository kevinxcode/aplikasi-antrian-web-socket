# Sistem Antrian dengan WebSocket

Aplikasi Node.js untuk sistem antrian real-time menggunakan WebSocket dengan 2 counter (loket).

## 📋 Fitur

- ✅ Tambah antrian baru dengan nama (opsional)
- ✅ 2 Counter/Loket terpisah
- ✅ Panggil antrian berikutnya per loket
- ✅ Panggil ulang nomor antrian tertentu
- ✅ Display real-time untuk nomor yang dipanggil
- ✅ Update otomatis menggunakan WebSocket
- ✅ Interface admin dan display terpisah
- ✅ Format nomor 3 digit (001, 002, 003, dst)
- ✅ Reset antrian

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

- **Admin Panel**: http://localhost:3000
- **Display Screen**: http://localhost:3000/display

Jika deploy di server:
- **Admin Panel**: http://your-server-ip:3000
- **Display Screen**: http://your-server-ip:3000/display

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

### Admin Panel

1. **Tambah Antrian Baru**
   - Masukkan nama (opsional)
   - Klik "Ambil Nomor Antrian"
   - Nomor akan muncul dengan format 001, 002, dst

2. **Panggil Antrian**
   - Klik "Panggil ke Loket 1" atau "Panggil ke Loket 2"
   - Nomor akan muncul di display screen

3. **Panggil Ulang Nomor**
   - Masukkan nomor antrian (contoh: 003)
   - Klik "Panggil Ulang ke Loket 1" atau "Panggil Ulang ke Loket 2"
   - Nomor akan dipanggil ulang dengan label "PANGGILAN ULANG"

4. **Reset Antrian**
   - Klik "Reset Antrian"
   - Semua antrian dan counter akan direset

### Display Screen

- Tampilkan di TV/Monitor terpisah
- Menampilkan nomor yang dipanggil dengan ukuran besar
- Menampilkan loket tujuan
- Menampilkan status kedua loket
- Menampilkan preview antrian selanjutnya
- Auto-refresh setiap 30 detik

## 🔌 API Endpoints

### POST /api/add-queue
Tambah antrian baru

**Request Body:**
```json
{
  "name": "John Doe"  // opsional
}
```

**Response:**
```json
{
  "success": true,
  "queueItem": {
    "id": 1699084800000,
    "number": "001",
    "name": "John Doe",
    "timestamp": "2024-11-04T02:00:00.000Z"
  }
}
```

### POST /api/next-queue
Panggil antrian berikutnya

**Request Body:**
```json
{
  "counter": 1  // 1 atau 2
}
```

**Response:**
```json
{
  "success": true,
  "called": {
    "number": "001",
    "name": "John Doe"
  },
  "counter": 1
}
```

### POST /api/recall-number
Panggil ulang nomor tertentu

**Request Body:**
```json
{
  "number": "003",
  "counter": 1
}
```

**Response:**
```json
{
  "success": true,
  "recalled": "003",
  "counter": 1
}
```

### POST /api/reset-queue
Reset semua antrian

**Response:**
```json
{
  "success": true,
  "message": "Antrian berhasil direset"
}
```

### GET /api/queue-status
Status antrian saat ini

**Response:**
```json
{
  "queue": [
    {
      "id": 1699084800000,
      "number": "002",
      "name": "Jane Doe",
      "timestamp": "2024-11-04T02:01:00.000Z"
    }
  ],
  "counters": {
    "1": { "current": "001", "name": "Loket 1" },
    "2": { "current": "000", "name": "Loket 2" }
  },
  "total": 1
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