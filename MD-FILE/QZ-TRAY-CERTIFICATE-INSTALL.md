# Install Certificate QZ Tray

Panduan install certificate QZ Tray untuk menghilangkan prompt "untrusted website".

## 🎯 Cara Termudah (Recommended)

### Opsi 1: Install Certificate dari QZ Tray

1. **Download Certificate**
   - Buka: https://qz.io/download/
   - Scroll ke bawah
   - Download: **"Digital Certificate"** (file `.crt`)

2. **Install Certificate di Browser**

   **Chrome/Edge:**
   - Buka Settings → Privacy and Security → Security
   - Scroll ke bawah → Manage Certificates
   - Tab "Trusted Root Certification Authorities"
   - Klik "Import"
   - Pilih file `.crt` yang didownload
   - Next → Finish
   - Restart browser

   **Firefox:**
   - Buka Settings → Privacy & Security
   - Scroll ke bawah → Certificates → View Certificates
   - Tab "Authorities"
   - Klik "Import"
   - Pilih file `.crt` yang didownload
   - Centang "Trust this CA to identify websites"
   - OK
   - Restart browser

3. **Restart QZ Tray**
   - Right-click icon QZ Tray → Exit
   - Jalankan QZ Tray lagi

4. **Test**
   - Refresh halaman aplikasi
   - Tidak ada prompt lagi! ✅

## 🔧 Cara Manual (Generate Certificate Sendiri)

### Step 1: Generate Certificate

**Windows:**
```bash
# Install OpenSSL dulu jika belum ada
# Download dari: https://slproweb.com/products/Win32OpenSSL.html

# Generate private key
openssl genrsa -out qz-private-key.pem 2048

# Generate certificate
openssl req -new -x509 -key qz-private-key.pem -out qz-certificate.crt -days 3650
```

**Linux/macOS:**
```bash
# Generate private key
openssl genrsa -out qz-private-key.pem 2048

# Generate certificate
openssl req -new -x509 -key qz-private-key.pem -out qz-certificate.crt -days 3650
```

Isi data certificate:
```
Country Name: ID
State: Jakarta
Locality: Jakarta
Organization: Your Company
Organizational Unit: IT
Common Name: localhost
Email: admin@localhost
```

### Step 2: Install Certificate

**Windows:**
1. Double-click file `qz-certificate.crt`
2. Klik "Install Certificate"
3. Pilih "Local Machine"
4. Next
5. Pilih "Place all certificates in the following store"
6. Browse → "Trusted Root Certification Authorities"
7. Next → Finish

**Linux:**
```bash
sudo cp qz-certificate.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

**macOS:**
```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain qz-certificate.crt
```

### Step 3: Configure Aplikasi

Simpan file `qz-certificate.crt` dan `qz-private-key.pem` di folder aplikasi:

```
app/
├── certificates/
│   ├── qz-certificate.crt
│   └── qz-private-key.pem
```

Update `printer-settings.html`:

```javascript
// Load certificate
qz.security.setCertificatePromise(function(resolve, reject) {
    fetch('/certificates/qz-certificate.crt')
        .then(response => response.text())
        .then(cert => resolve(cert))
        .catch(err => reject(err));
});

// Sign request
qz.security.setSignaturePromise(function(toSign) {
    return function(resolve, reject) {
        fetch('/api/sign-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: toSign })
        })
        .then(response => response.text())
        .then(signature => resolve(signature))
        .catch(err => reject(err));
    };
});
```

### Step 4: Backend Signing (Node.js)

Update `index.js`:

```javascript
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Serve certificate
app.get('/certificates/qz-certificate.crt', (req, res) => {
    res.sendFile(path.join(__dirname, 'certificates', 'qz-certificate.crt'));
});

// Sign message endpoint
app.post('/api/sign-message', (req, res) => {
    try {
        const privateKey = fs.readFileSync(
            path.join(__dirname, 'certificates', 'qz-private-key.pem'),
            'utf8'
        );
        
        const sign = crypto.createSign('SHA256');
        sign.update(req.body.message);
        sign.end();
        
        const signature = sign.sign(privateKey, 'hex');
        res.send(signature);
    } catch (error) {
        console.error('Signing error:', error);
        res.status(500).send('Signing failed');
    }
});
```

### Step 5: Restart & Test

```bash
# Restart aplikasi
docker-compose restart

# Atau manual
cd app
npm start
```

Refresh browser → Tidak ada prompt lagi! ✅

## 📋 Troubleshooting

### Certificate tidak terdeteksi

**Solusi:**
1. Pastikan certificate sudah terinstall di browser
2. Restart browser setelah install
3. Restart QZ Tray
4. Clear browser cache

### Masih muncul prompt

**Solusi:**
1. Cek certificate sudah di "Trusted Root Certification Authorities"
2. Cek Common Name certificate = `localhost` atau domain yang digunakan
3. Cek certificate belum expired
4. Restart komputer

### Error "Certificate validation failed"

**Solusi:**
1. Generate ulang certificate dengan Common Name yang benar
2. Install ulang certificate
3. Restart QZ Tray dan browser

## 🎓 Rekomendasi

### Development (Localhost):
✅ **Cara Termudah:** Klik "Always Allow" atau whitelist di Site Manager
- Tidak perlu install certificate
- Cepat dan mudah
- Cukup untuk development

### Production (HTTPS):
✅ **Install Certificate:** Generate dan install proper certificate
- Lebih professional
- Tidak ada prompt untuk user
- Lebih aman

### Internal Network:
✅ **Whitelist di QZ Tray:** Site Manager
- Tidak perlu certificate
- Permanent solution
- Mudah di-manage

## 📚 Referensi

- **QZ Tray Certificate:** https://qz.io/wiki/using-a-self-signed-certificate
- **QZ Tray Security:** https://qz.io/wiki/security
- **OpenSSL:** https://www.openssl.org/

---

**Untuk development, cukup klik "Always Allow"! 🚀**
