# Setup Printer Thermal 58mm

Panduan lengkap untuk mengintegrasikan printer thermal 58mm dengan sistem antrian.

## 📋 Persyaratan

### Hardware
- Printer thermal 58mm (USB)
- Kabel USB
- Komputer/Server dengan port USB

### Software
- Node.js 18+
- Driver printer thermal (biasanya otomatis terdeteksi)

## 🔧 Instalasi

### 1. Install Dependencies

Masuk ke folder `app` dan install dependencies:

```bash
cd app
npm install
```

Dependencies yang akan terinstall:
- `escpos`: Library untuk ESC/POS command
- `escpos-usb`: Driver USB untuk printer thermal

### 2. Setup Database

Tabel `printer_settings` akan otomatis dibuat saat aplikasi pertama kali dijalankan.

### 3. Hubungkan Printer

1. Colokkan printer thermal ke port USB
2. Pastikan printer menyala
3. Windows akan otomatis mendeteksi printer

### 4. Cek Printer Terdeteksi

Untuk memastikan printer terdeteksi, jalankan:

```bash
node -e "const usb = require('escpos-usb'); const devices = usb.USB.findPrinter(); console.log('Devices:', devices);"
```

Jika printer terdeteksi, akan muncul informasi device.

## 🖨️ Cara Menggunakan

### 1. Akses Menu Pengaturan Printer

1. Login sebagai **admin**
2. Buka menu **Pengaturan Printer** atau akses: `http://localhost:3000/printer-settings`

### 2. Konfigurasi Struk

Isi form pengaturan:

**Judul Struk:**
```
BTN Syariah
```

**Alamat:**
```
Jl. Sopo Del No 56 Jakarta Selatan
```

**Catatan Footer (Opsional):**
```
Terima kasih atas kunjungan Anda
Mohon tunggu nomor Anda dipanggil
```

### 3. Preview Struk

Preview akan otomatis update saat Anda mengetik. Pastikan semua informasi sudah benar.

### 4. Test Print

Klik tombol **"🖨️ Test Print"** untuk mencoba cetak struk test dengan nomor A001.

Jika berhasil, printer akan mencetak struk test.

### 5. Simpan Pengaturan

Klik **"💾 Simpan Pengaturan"** untuk menyimpan konfigurasi.

## 📄 Format Struk

Struk yang dicetak akan memiliki format:

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

### Detail Format:
- **Lebar kertas**: 58mm
- **Encoding**: UTF-8
- **Alignment**: Center (rata tengah)
- **Nomor antrian**: Double height & double width (sangat besar)
- **Auto cut**: Ya (potong kertas otomatis)

## 🔄 Cara Kerja

### Otomatis Print Saat Ambil Nomor

Ketika customer mengambil nomor antrian di `/ambil-nomor.html`:

1. Customer pilih layanan (CS atau Teller)
2. Sistem generate nomor antrian
3. **Printer otomatis mencetak struk**
4. Nomor masuk ke antrian
5. Display update real-time

### Non-Blocking Print

Print berjalan di background (non-blocking):
- Jika printer error, sistem tetap jalan
- Nomor tetap masuk antrian
- Error hanya dicatat di log

## 🐛 Troubleshooting

### Printer Tidak Terdeteksi

**Solusi:**

1. Cek koneksi USB
2. Restart printer
3. Install driver printer (jika perlu)
4. Cek dengan command:
```bash
node -e "const usb = require('escpos-usb'); console.log(usb.USB.findPrinter());"
```

### Error: LIBUSB_ERROR_ACCESS (Windows)

**Solusi:**

Install Zadig untuk USB driver:

1. Download Zadig: https://zadig.akeo.ie/
2. Jalankan Zadig
3. Pilih printer dari list
4. Install driver WinUSB
5. Restart aplikasi

### Error: Cannot find printer

**Solusi:**

1. Pastikan printer menyala
2. Cek kabel USB
3. Coba port USB lain
4. Restart komputer

### Print Tidak Keluar

**Solusi:**

1. Cek kertas thermal masih ada
2. Cek printer tidak paper jam
3. Test print dari button test
4. Cek log error di console

### Karakter Tidak Terbaca

**Solusi:**

1. Pastikan encoding UTF-8
2. Update firmware printer (jika ada)
3. Gunakan karakter ASCII standar

## 📝 Kustomisasi

### Mengubah Ukuran Font

Edit file `app/printer.js`:

```javascript
// Ukuran normal
.size(1, 1)

// Ukuran besar (2x)
.size(2, 2)

// Ukuran sangat besar (3x)
.size(3, 3)
```

### Menambah Logo

```javascript
const escpos = require('escpos');
const image = require('escpos').Image;

// Load image
const logo = await image.load('path/to/logo.png');

printer
    .align('ct')
    .image(logo, 'd24')  // density 24
    .then(() => {
        // Continue printing
    });
```

### Mengubah Lebar Kertas

Untuk printer 80mm, ubah di `printer.js`:

```javascript
// Ganti garis pemisah
.text('------------------------------------------------')
```

## 🔐 Keamanan

### Akses Menu Pengaturan

- Hanya **admin** yang bisa akses `/printer-settings`
- User CS dan Teller tidak bisa mengubah pengaturan
- Semua perubahan dicatat di database

### Validasi Input

- Semua input di-sanitize
- Maksimal panjang text dibatasi
- SQL injection protected

## 📊 Monitoring

### Log Print

Semua aktivitas print dicatat di console:

```
Print success: A001
Print failed (non-blocking): Printer not found
```

### Database Log

Setiap perubahan pengaturan dicatat:
- User yang mengubah
- Waktu perubahan
- Data sebelum dan sesudah

## 🚀 Production Tips

### 1. Backup Printer

Siapkan printer cadangan untuk antisipasi kerusakan.

### 2. Maintenance Rutin

- Bersihkan head printer setiap minggu
- Cek stok kertas thermal
- Test print setiap hari

### 3. Monitoring

Setup monitoring untuk:
- Printer status
- Paper low warning
- Print error rate

### 4. Auto-Restart

Jika printer sering error, setup auto-restart:

```javascript
// Di printer.js
let retryCount = 0;
const MAX_RETRY = 3;

function printWithRetry(data) {
    printReceipt(data, pool).catch(err => {
        if (retryCount < MAX_RETRY) {
            retryCount++;
            setTimeout(() => printWithRetry(data), 2000);
        }
    });
}
```

## 📞 Support

Jika ada masalah:

1. Cek log error di console
2. Test printer dengan test print
3. Cek dokumentasi escpos: https://github.com/song940/node-escpos
4. Restart aplikasi dan printer

## 🎯 Fitur Tambahan (Opsional)

### Print QR Code

```javascript
const QRCode = require('qrcode');

// Generate QR
const qr = await QRCode.toDataURL(queueNumber);
printer.qrimage(qr);
```

### Print Barcode

```javascript
printer
    .barcode(queueNumber, 'CODE39', {
        width: 2,
        height: 50
    });
```

### Multiple Printer

Untuk setup multiple printer (ambil nomor di beberapa lokasi):

```javascript
// printer.js
const printers = {
    location1: new escpos.USB(vendorId1, productId1),
    location2: new escpos.USB(vendorId2, productId2)
};
```

---

**Selamat menggunakan fitur printer thermal! 🎉**
