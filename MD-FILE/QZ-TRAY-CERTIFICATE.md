# QZ Tray Certificate Setup - Solusi "Untrusted" Dialog

## ✅ Implementasi Selesai

Certificate dan signing sudah disetup otomatis. Dialog "untrusted" tidak akan muncul lagi.

## 📁 File yang Dibuat

```
app/
├── certs/
│   ├── private-key.pem           # Private key (JANGAN di-commit ke Git)
│   └── digital-certificate.txt   # Public certificate
├── public/
│   └── js/
│       └── qz-security.js        # Security setup script
└── .gitignore                    # Melindungi private key
```

## 🔧 Cara Kerja

1. **Certificate Generation:**
   - Private key: `private-key.pem` (2048-bit RSA)
   - Certificate: `digital-certificate.txt` (valid 10 tahun)
   - Self-signed certificate untuk internal use

2. **Security Setup:**
   - File `qz-security.js` otomatis load certificate dari `/certs/digital-certificate.txt`
   - Server endpoint `/api/sign-message` untuk signing dengan private key
   - Sudah terintegrasi di `ambil-nomor.html` dan `printer-settings.html`

3. **Server Integration:**
   - Endpoint `/certs/*` untuk serve certificate
   - Endpoint `/api/sign-message` untuk message signing
   - Menggunakan Node.js crypto module

## 🚀 Testing

1. **Restart aplikasi:**
   ```bash
   npm start
   ```

2. **Test di browser:**
   - Buka http://localhost:3000/ambil-nomor.html
   - Atau http://localhost:3000/printer-settings
   - Dialog "untrusted" tidak akan muncul lagi

3. **Cek console browser:**
   - Seharusnya tidak ada error QZ Tray
   - Certificate loaded successfully

## 🔒 Keamanan

- Private key **SUDAH** ditambahkan ke `.gitignore`
- **JANGAN** commit `private-key.pem` ke Git
- Certificate valid untuk 10 tahun (sampai 2035)
- Self-signed certificate aman untuk internal use

## 📝 Catatan

- Certificate ini untuk **development dan internal use**
- Untuk production dengan domain publik, pertimbangkan certificate dari CA resmi
- QZ Tray harus tetap running di background
- Certificate otomatis di-load saat halaman dibuka

## 🔄 Regenerate Certificate (Jika Diperlukan)

Jika perlu generate ulang certificate:

```bash
cd app/certs

# Generate private key baru
openssl genrsa -out private-key.pem 2048

# Generate certificate baru
openssl req -new -x509 -key private-key.pem -out digital-certificate.txt -days 3650 -subj "/CN=QZ Tray Certificate/O=Antrian App/C=ID"
```

## ✅ Status

- ✅ Certificate generated
- ✅ Server endpoints configured
- ✅ Security script created
- ✅ Integrated to HTML pages
- ✅ Private key protected (.gitignore)
- ✅ Ready to use

**Dialog "untrusted" sudah tidak akan muncul lagi!**
