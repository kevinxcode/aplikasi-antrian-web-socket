# Setup Database PostgreSQL

## Default Users

Setelah aplikasi berjalan, database akan otomatis membuat user default:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| cs1 | cs123 | cs |
| cs2 | cs123 | cs |
| teller1 | teller123 | teller |
| teller2 | teller123 | teller |

## Role & Permission

### Admin
- Akses penuh ke semua fitur
- Dapat memanggil antrian CS dan Teller
- Dapat reset antrian
- Dapat melihat history transaksi

### CS (Customer Service)
- Hanya dapat memanggil antrian CS (CS1 atau CS2)
- Tidak dapat memanggil antrian Teller
- Tidak dapat reset antrian

### Teller
- Hanya dapat memanggil antrian Teller (Teller1 atau Teller2)
- Tidak dapat memanggil antrian CS
- Tidak dapat reset antrian

## Cara Menjalankan

### Dengan Docker (Recommended)

```bash
# Build dan jalankan semua service (PostgreSQL + App)
docker-compose up -d --build

# Cek logs
docker-compose logs -f

# Stop semua service
docker-compose down
```

### Manual (Tanpa Docker)

1. Install PostgreSQL
2. Buat database:
```sql
CREATE DATABASE antrian_db;
CREATE USER antrian WITH PASSWORD 'antrian123';
GRANT ALL PRIVILEGES ON DATABASE antrian_db TO antrian;
```

3. Set environment variables:
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=antrian
export DB_PASSWORD=antrian123
export DB_NAME=antrian_db
```

4. Jalankan aplikasi:
```bash
cd app
npm install
node index-new.js
```

## Database Schema

### Table: users
```sql
- id (SERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- password (VARCHAR - hashed)
- role (VARCHAR: admin, cs, teller)
- created_at (TIMESTAMP)
```

### Table: queue_transactions
```sql
- id (SERIAL PRIMARY KEY)
- queue_number (VARCHAR)
- queue_type (VARCHAR: cs, teller)
- customer_name (VARCHAR)
- counter (VARCHAR)
- status (VARCHAR: waiting, called, completed)
- called_by (INTEGER - user id)
- created_at (TIMESTAMP)
- called_at (TIMESTAMP)
- completed_at (TIMESTAMP)
```

## Akses Aplikasi

- Login: http://localhost:3000/login
- Admin Panel: http://localhost:3000/admin (setelah login)
- Ambil Nomor: http://localhost:3000/ambil-nomor
- Display: http://localhost:3000/display

## Mengganti Password

Gunakan bcrypt untuk hash password baru:

```javascript
const bcrypt = require('bcrypt');
const newPassword = await bcrypt.hash('password_baru', 10);
// Update ke database
```

## Backup Database

```bash
# Backup
docker exec antrian-postgres pg_dump -U antrian antrian_db > backup.sql

# Restore
docker exec -i antrian-postgres psql -U antrian antrian_db < backup.sql
```
