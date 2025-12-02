# Printer API Documentation

Dokumentasi lengkap API untuk fitur printer thermal.

## 📡 API Endpoints

### 1. Get Printer Settings

Mengambil pengaturan printer saat ini.

**Endpoint:** `GET /api/printer-settings`

**Auth:** Admin only

**Response:**
```json
{
  "success": true,
  "settings": {
    "id": 1,
    "title": "BTN Syariah",
    "address": "Jl. Sopo Del No 56 Jakarta Selatan",
    "footer_note": "Terima kasih atas kunjungan Anda",
    "updated_at": "2025-01-01T10:00:00.000Z",
    "updated_by": 1
  }
}
```

**Example:**
```javascript
const response = await fetch('/api/printer-settings');
const data = await response.json();
console.log(data.settings.title); // "BTN Syariah"
```

---

### 2. Update Printer Settings

Mengupdate pengaturan printer.

**Endpoint:** `POST /api/printer-settings`

**Auth:** Admin only

**Request Body:**
```json
{
  "title": "BTN Syariah",
  "address": "Jl. Sopo Del No 56 Jakarta Selatan",
  "footer_note": "Terima kasih atas kunjungan Anda"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pengaturan printer berhasil diupdate"
}
```

**Example:**
```javascript
const response = await fetch('/api/printer-settings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'BTN Syariah',
    address: 'Jl. Sopo Del No 56 Jakarta Selatan',
    footer_note: 'Terima kasih'
  })
});
const data = await response.json();
```

---

### 3. Test Print

Melakukan test print dengan data dummy.

**Endpoint:** `POST /api/test-print`

**Auth:** Admin only

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Test print berhasil"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Test print gagal: Printer not found"
}
```

**Example:**
```javascript
const response = await fetch('/api/test-print', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});
const data = await response.json();
if (data.success) {
  alert('Test print berhasil!');
} else {
  alert('Error: ' + data.message);
}
```

---

## 🔧 Printer Module

### printReceipt(queueData, pool)

Fungsi utama untuk mencetak struk.

**Parameters:**
- `queueData` (Object): Data antrian
  - `number` (String): Nomor antrian (e.g., "A001")
  - `type` (String): Tipe antrian ("cs" atau "teller")
  - `name` (String): Nama customer (optional)
- `pool` (Object): PostgreSQL connection pool

**Returns:** Promise<boolean>

**Example:**
```javascript
const { printReceipt } = require('./printer');
const { pool } = require('./db');

const queueData = {
  number: 'A001',
  type: 'cs',
  name: 'John Doe'
};

try {
  await printReceipt(queueData, pool);
  console.log('Print success');
} catch (error) {
  console.error('Print failed:', error);
}
```

---

### loadPrinterSettings(pool)

Memuat pengaturan printer dari database.

**Parameters:**
- `pool` (Object): PostgreSQL connection pool

**Returns:** Promise<void>

**Example:**
```javascript
const { loadPrinterSettings } = require('./printer');
const { pool } = require('./db');

await loadPrinterSettings(pool);
```

---

## 🎨 Format Struk

### Default Format

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

### ESC/POS Commands

```javascript
printer
  .font('a')              // Font A (default)
  .align('ct')            // Center align
  .style('normal')        // Normal style
  .size(1, 1)             // Normal size
  .text('Text')           // Print text
  .size(2, 2)             // Double size
  .style('b')             // Bold
  .cut()                  // Cut paper
  .close()                // Close connection
```

---

## 🔄 Integration Flow

### 1. Ambil Nomor Flow

```
Customer → Klik Button → API /api/add-queue → 
Generate Nomor → Save to DB → Print Receipt → 
WebSocket Update → Display Update
```

### 2. Print Flow

```javascript
// Di index.js
app.post('/api/add-queue', async (req, res) => {
  // ... generate queue number ...
  
  // Print receipt (non-blocking)
  const { printReceipt } = require('./printer');
  printReceipt(queueItem, pool).catch(err => {
    console.error('Print failed:', err.message);
  });
  
  res.json({ success: true, queueItem });
});
```

---

## 🗄️ Database Schema

### printer_settings Table

```sql
CREATE TABLE printer_settings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) DEFAULT 'BTN Syariah',
  address VARCHAR(255) DEFAULT 'Jl. Sopo Del No 56 Jakarta Selatan',
  footer_note TEXT DEFAULT '',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER REFERENCES users(id)
);
```

**Fields:**
- `id`: Primary key
- `title`: Judul struk (nama perusahaan)
- `address`: Alamat lengkap
- `footer_note`: Catatan footer (opsional)
- `updated_at`: Waktu update terakhir
- `updated_by`: User yang mengupdate

---

## 🔐 Security

### Authorization

Semua endpoint printer memerlukan:
1. User harus login (session valid)
2. User harus memiliki role "admin"

```javascript
app.get('/api/printer-settings', 
  requireAuth, 
  requireRole('admin'), 
  async (req, res) => {
    // ...
  }
);
```

### Input Validation

- `title`: Max 100 karakter
- `address`: Max 255 karakter
- `footer_note`: Max 1000 karakter (TEXT)
- Semua input di-sanitize untuk mencegah SQL injection

---

## 🐛 Error Handling

### Common Errors

**1. Printer Not Found**
```json
{
  "success": false,
  "message": "Test print gagal: Cannot find printer"
}
```

**Solution:** Cek koneksi USB, pastikan printer menyala

**2. LIBUSB_ERROR_ACCESS**
```json
{
  "success": false,
  "message": "Test print gagal: LIBUSB_ERROR_ACCESS"
}
```

**Solution:** Install Zadig untuk USB driver (Windows)

**3. Database Error**
```json
{
  "success": false,
  "message": "Gagal mengambil pengaturan printer"
}
```

**Solution:** Cek koneksi database

---

## 📊 Monitoring

### Log Print Activity

Semua aktivitas print dicatat di console:

```javascript
console.log('Print success:', queueNumber);
console.error('Print failed (non-blocking):', error.message);
```

### Database Audit

Setiap perubahan pengaturan dicatat:
- User yang mengubah (`updated_by`)
- Waktu perubahan (`updated_at`)

Query audit log:
```sql
SELECT 
  ps.*,
  u.username,
  u.full_name
FROM printer_settings ps
LEFT JOIN users u ON ps.updated_by = u.id
ORDER BY ps.updated_at DESC;
```

---

## 🚀 Advanced Usage

### Custom Print Function

```javascript
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

function customPrint(data) {
  const device = new escpos.USB();
  const printer = new escpos.Printer(device, { encoding: 'UTF-8' });
  
  device.open(function(error) {
    if (error) throw error;
    
    printer
      .font('a')
      .align('ct')
      .size(1, 1)
      .text('Custom Print')
      .text(data.customField)
      .cut()
      .close();
  });
}
```

### Multiple Printers

```javascript
// Setup multiple printers
const printers = {
  location1: new escpos.USB(0x04b8, 0x0e15), // Vendor & Product ID
  location2: new escpos.USB(0x04b8, 0x0e16)
};

// Print to specific printer
function printToLocation(location, data) {
  const device = printers[location];
  const printer = new escpos.Printer(device);
  // ... print logic
}
```

### Print with Logo

```javascript
const escpos = require('escpos');
const Image = escpos.Image;

async function printWithLogo(queueData) {
  const device = new escpos.USB();
  const printer = new escpos.Printer(device);
  
  device.open(async function(error) {
    if (error) throw error;
    
    // Load logo
    const logo = await Image.load('path/to/logo.png');
    
    printer
      .align('ct')
      .image(logo, 'd24')
      .text('BTN Syariah')
      .text(queueData.number)
      .cut()
      .close();
  });
}
```

---

## 📝 Best Practices

1. **Non-Blocking Print**: Jangan block request jika print gagal
2. **Error Logging**: Log semua error untuk debugging
3. **Retry Logic**: Implement retry untuk print yang gagal
4. **Settings Cache**: Cache settings untuk performa
5. **Test Regularly**: Test print setiap hari sebelum operasional

---

## 🔗 References

- ESC/POS Documentation: https://github.com/song940/node-escpos
- USB Library: https://github.com/node-escpos/driver
- Thermal Printer Commands: https://reference.epson-biz.com/modules/ref_escpos/

---

**Last Updated:** 2025-01-01
