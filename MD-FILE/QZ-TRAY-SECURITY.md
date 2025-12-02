# QZ Tray Security & Certificate

Panduan mengatasi security prompt "Anonymous request wants to access connected printer"

## 🔒 Apa itu Security Prompt?

Saat pertama kali connect ke QZ Tray, muncul dialog:
```
⚠️ Anonymous request wants to access connected printer
[Block] [Allow] [Always Allow]
```

Ini adalah fitur keamanan QZ Tray untuk mencegah akses tidak sah ke printer.

## ✅ Solusi Cepat (Recommended)

### Opsi 1: Klik "Always Allow" (Paling Mudah)

1. Saat muncul prompt, klik **"Always Allow"**
2. QZ Tray akan ingat dan tidak tanya lagi
3. Hanya untuk domain/localhost yang sama
4. Selesai! ✅

### Opsi 2: Whitelist di QZ Tray Settings

1. **Buka QZ Tray** (right-click icon di system tray)
2. Klik **"Advanced"** → **"Site Manager"**
3. Klik **"Add"**
4. Isi:
   ```
   Site: localhost
   atau
   Site: 127.0.0.1
   ```
5. Centang **"Allow"**
6. Klik **"Save"**
7. Selesai! ✅

## 🔧 Solusi Teknis (Sudah Diimplementasi)

Aplikasi sudah dikonfigurasi untuk bypass certificate signing:

```javascript
// Auto-approve connection (no certificate required)
qz.security.setCertificatePromise(function(resolve, reject) {
    resolve(); // No certificate needed
});

qz.security.setSignaturePromise(function(toSign) {
    return function(resolve, reject) {
        resolve(); // No signature needed
    };
});
```

**Catatan:** Ini aman untuk localhost/internal network. Untuk production dengan HTTPS, gunakan proper certificate.

## 🎯 Kenapa Muncul Prompt?

### Penyebab:
1. **Pertama kali connect** - QZ Tray belum kenal aplikasi
2. **Belum whitelist** - Domain belum di-allow
3. **Security feature** - Proteksi dari akses tidak sah

### Kapan Muncul:
- ✅ Pertama kali buka halaman
- ✅ Setelah clear browser cache
- ✅ Setelah restart QZ Tray
- ❌ Tidak muncul lagi setelah "Always Allow"

## 📋 Step-by-Step: Whitelist Permanent

### Windows:

1. **Buka QZ Tray**
   - Right-click icon QZ Tray di system tray
   - Klik "Open"

2. **Masuk ke Site Manager**
   - Tab "Advanced"
   - Klik "Site Manager"

3. **Tambah Whitelist**
   - Klik tombol "+" atau "Add"
   - Site: `localhost` atau `127.0.0.1`
   - Centang "Allow"
   - Klik "Save"

4. **Restart Browser**
   - Close semua tab aplikasi
   - Buka lagi
   - Tidak ada prompt lagi! ✅

### Linux/macOS:

1. **Buka QZ Tray**
   ```bash
   # QZ Tray biasanya auto-start
   # Atau jalankan manual dari Applications
   ```

2. **Site Manager**
   - Klik icon QZ Tray
   - Preferences → Site Manager
   - Add → localhost
   - Allow → Save

3. **Test**
   - Refresh browser
   - Tidak ada prompt! ✅

## 🔐 Security Best Practices

### Development (Localhost):
```javascript
// ✅ OK: No certificate (sudah diimplementasi)
qz.security.setCertificatePromise(resolve => resolve());
```
- Cepat dan mudah
- Aman untuk localhost
- Tidak perlu certificate

### Production (HTTPS):
```javascript
// ⚠️ Recommended: Use proper certificate
qz.security.setCertificatePromise(function(resolve, reject) {
    fetch('/path/to/certificate.pem')
        .then(response => response.text())
        .then(cert => resolve(cert));
});
```
- Lebih aman
- Tidak ada prompt
- Professional

## 🆘 Troubleshooting

### Prompt Terus Muncul

**Penyebab:** Klik "Allow" (bukan "Always Allow")

**Solusi:**
1. Klik **"Always Allow"** (bukan "Allow")
2. Atau whitelist di Site Manager
3. Restart browser

### Prompt Muncul Setelah Restart

**Penyebab:** QZ Tray tidak save setting

**Solusi:**
1. Whitelist di Site Manager (permanent)
2. Atau generate proper certificate
3. Lihat dokumentasi di bawah

### "Certificate Required" Error

**Penyebab:** QZ Tray versi baru require certificate

**Solusi:**
1. Update aplikasi dengan proper certificate
2. Atau downgrade QZ Tray ke versi lama
3. Atau whitelist di Site Manager

## 📚 Generate Certificate (Advanced)

Jika ingin proper certificate untuk production:

### 1. Generate Certificate
```bash
# Download QZ Certificate Tool
https://qz.io/wiki/using-a-self-signed-certificate

# Generate certificate
keytool -genkey -alias qz -keyalg RSA -keystore qz-keystore.jks
```

### 2. Export Public Certificate
```bash
keytool -export -alias qz -keystore qz-keystore.jks -file qz-certificate.pem
```

### 3. Sign Request
```javascript
qz.security.setCertificatePromise(function(resolve, reject) {
    fetch('/qz-certificate.pem')
        .then(r => r.text())
        .then(cert => resolve(cert));
});

qz.security.setSignaturePromise(function(toSign) {
    return function(resolve, reject) {
        fetch('/sign-message', {
            method: 'POST',
            body: JSON.stringify({ message: toSign })
        })
        .then(r => r.text())
        .then(signature => resolve(signature));
    };
});
```

### 4. Backend Signing (Node.js)
```javascript
const crypto = require('crypto');
const fs = require('fs');

app.post('/sign-message', (req, res) => {
    const privateKey = fs.readFileSync('private-key.pem');
    const sign = crypto.createSign('SHA256');
    sign.update(req.body.message);
    const signature = sign.sign(privateKey, 'hex');
    res.send(signature);
});
```

## 🎓 Referensi

- **QZ Tray Security:** https://qz.io/wiki/security
- **Certificate Guide:** https://qz.io/wiki/using-a-self-signed-certificate
- **Site Manager:** https://qz.io/wiki/site-manager
- **Signing Guide:** https://qz.io/wiki/signing-messages

## 💡 Rekomendasi

### Untuk Development:
✅ **Klik "Always Allow"** - Paling mudah dan cepat

### Untuk Production:
✅ **Whitelist di Site Manager** - Permanent solution
✅ **Generate Certificate** - Professional dan aman

### Untuk Internal Network:
✅ **Whitelist di Site Manager** - Cukup untuk internal use

## 📊 Comparison

| Method | Setup Time | Security | User Experience |
|--------|-----------|----------|-----------------|
| Always Allow | 5 detik | Medium | Prompt 1x |
| Site Manager | 2 menit | Medium | No prompt |
| Certificate | 30 menit | High | No prompt |

## ✅ Kesimpulan

**Solusi Tercepat:**
1. Klik **"Always Allow"** saat prompt muncul
2. Atau whitelist `localhost` di QZ Tray Site Manager
3. Selesai! Tidak ada prompt lagi ✅

**Aplikasi sudah dikonfigurasi** untuk bypass certificate, jadi prompt hanya muncul 1x pertama kali.

---

**Security prompt adalah fitur, bukan bug! 🔒**
