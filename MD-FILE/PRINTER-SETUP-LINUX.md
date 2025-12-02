# 🐧 Setup Printer Thermal di Linux/Ubuntu

Panduan lengkap setup printer thermal 58mm/80mm di Linux/Ubuntu untuk sistem antrian.

## 📋 Prasyarat

- Ubuntu 20.04+ / Debian 10+
- Node.js 18+
- Printer thermal USB (58mm atau 80mm)
- Akses sudo/root

---

## 🚀 Quick Setup (5 Menit)

### 1. Install Dependencies Sistem

```bash
# Update package list
sudo apt-get update

# Install Python dan build tools
sudo apt-get install -y python3 python3-pip build-essential libusb-1.0-0-dev libudev-dev

# Verify instalasi
python3 --version
```

### 2. Setup USB Permissions

```bash
# Tambahkan user ke group printer
sudo usermod -a -G lp $USER
sudo usermod -a -G dialout $USER

# Buat udev rules untuk USB printer
echo 'SUBSYSTEM=="usb", MODE="0666", GROUP="lp"' | sudo tee /etc/udev/rules.d/99-escpos.rules

# Reload udev rules
sudo udevadm control --reload-rules
sudo udevadm trigger

# Verify group membership
groups $USER
```

### 3. Logout & Login Ulang

```bash
# PENTING: Logout dan login ulang agar group changes berlaku
# Atau restart sistem:
sudo reboot
```

### 4. Install Node.js Dependencies

```bash
cd app
npm install

# Test printer detection
node check-printers.js
```

### 5. Jalankan Aplikasi

```bash
npm start
```

---

## 🔍 Troubleshooting

### Problem 1: Printer Tidak Terdeteksi

**Cek printer terhubung:**
```bash
lsusb
```

Output contoh:
```
Bus 001 Device 005: ID 0416:5011 Winbond Electronics Corp. Printer
```

**Cek permissions:**
```bash
ls -l /dev/bus/usb/001/005
```

Harus ada `rw-rw-rw-` atau `rw-rw-r--`

**Fix permissions:**
```bash
sudo chmod 666 /dev/bus/usb/001/005
```

---

### Problem 2: LIBUSB_ERROR_ACCESS

**Error:**
```
Error: LIBUSB_ERROR_ACCESS
```

**Solusi:**

```bash
# Cek current user
whoami

# Tambahkan ke group lagi
sudo usermod -a -G lp $(whoami)
sudo usermod -a -G dialout $(whoami)

# Buat udev rules lebih permissive
sudo nano /etc/udev/rules.d/99-escpos.rules
```

Isi dengan:
```
SUBSYSTEM=="usb", ATTRS{idVendor}=="*", MODE="0666", GROUP="lp"
SUBSYSTEM=="usb_device", MODE="0666", GROUP="lp"
```

```bash
# Reload
sudo udevadm control --reload-rules
sudo udevadm trigger

# Logout & login ulang
```

---

### Problem 3: Cannot Find Printer

**Cek printer dengan lsusb:**
```bash
lsusb | grep -i printer
```

**Cek dengan Node.js:**
```bash
cd app
node -e "const usb = require('escpos-usb'); console.log(usb.USB.findPrinter());"
```

**Jika tidak muncul:**
```bash
# Cabut dan colok ulang printer
# Cek dmesg untuk error
dmesg | tail -20

# Cek USB devices
ls -la /dev/usb/
```

---

### Problem 4: Permission Denied

**Error:**
```
Error: Permission denied
```

**Solusi cepat:**
```bash
# Run dengan sudo (temporary)
sudo npm start

# Atau fix permissions permanent:
sudo chown -R $USER:$USER /dev/bus/usb/
```

**Solusi permanent:**
```bash
# Buat systemd service dengan permissions
sudo nano /etc/systemd/system/antrian.service
```

Isi:
```ini
[Unit]
Description=Sistem Antrian
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/path/to/app
ExecStart=/usr/bin/node index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable antrian
sudo systemctl start antrian
```

---

## 🐳 Setup dengan Docker (Recommended)

Docker sudah include semua dependencies dan permissions!

### 1. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Tambahkan user ke docker group
sudo usermod -aG docker $USER

# Logout & login ulang
```

### 2. Install Docker Compose

```bash
sudo apt-get install docker-compose-plugin
```

### 3. Jalankan Aplikasi

```bash
# Build dan start
docker-compose up -d --build

# Cek logs
docker-compose logs -f

# Stop
docker-compose down
```

### 4. USB Passthrough ke Docker

Edit `docker-compose.yml`:

```yaml
services:
  app:
    # ... existing config ...
    devices:
      - /dev/bus/usb:/dev/bus/usb
    privileged: true
```

Restart:
```bash
docker-compose down
docker-compose up -d
```

---

## 📝 Verifikasi Setup

### Test 1: Cek Printer Terdeteksi

```bash
cd app
node check-printers.js
```

Output yang diharapkan:
```
✅ Ditemukan 1 printer:

Printer 1:
  Vendor ID:  0x0416
  Product ID: 0x5011
  ⭐ Printer ini akan dipilih secara otomatis
```

### Test 2: Test Print

```bash
node test-printer.js
```

Struk harus keluar dari printer.

### Test 3: Test dari Aplikasi

```bash
npm start
```

Buka browser: `http://localhost:3000/ambil-nomor.html`

Klik button CS/Teller → Struk harus tercetak.

---

## 🔐 Security Best Practices

### 1. Jangan Run sebagai Root

```bash
# Buat user khusus
sudo useradd -m -s /bin/bash antrian
sudo usermod -a -G lp antrian
sudo usermod -a -G dialout antrian

# Copy aplikasi
sudo cp -r /path/to/app /home/antrian/
sudo chown -R antrian:antrian /home/antrian/app

# Run sebagai user antrian
sudo -u antrian npm start
```

### 2. Gunakan systemd Service

Lihat contoh di Problem 4 di atas.

### 3. Firewall

```bash
# Allow port 3000
sudo ufw allow 3000/tcp
sudo ufw enable
```

---

## 🎯 Production Deployment

### Opsi 1: PM2 (Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Start aplikasi
cd app
pm2 start index.js --name antrian

# Auto-start on boot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

### Opsi 2: Systemd Service

```bash
sudo nano /etc/systemd/system/antrian.service
```

```ini
[Unit]
Description=Sistem Antrian BTN Syariah
After=network.target postgresql.service

[Service]
Type=simple
User=antrian
WorkingDirectory=/home/antrian/app
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=antrian

Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable antrian
sudo systemctl start antrian
sudo systemctl status antrian
```

### Opsi 3: Docker (Recommended)

Sudah dijelaskan di atas.

---

## 📊 Monitoring

### Cek Logs

**PM2:**
```bash
pm2 logs antrian
```

**Systemd:**
```bash
sudo journalctl -u antrian -f
```

**Docker:**
```bash
docker-compose logs -f
```

### Cek Status Printer

```bash
# Cek USB devices
lsusb

# Cek printer status
lpstat -p -d

# Cek permissions
ls -l /dev/bus/usb/001/
```

---

## 🔄 Update Aplikasi

```bash
# Stop aplikasi
pm2 stop antrian
# atau
sudo systemctl stop antrian

# Pull update
git pull

# Install dependencies
cd app
npm install

# Start ulang
pm2 start antrian
# atau
sudo systemctl start antrian
```

---

## 📋 Checklist Setup

- [ ] Python3 terinstall
- [ ] Build tools terinstall
- [ ] libusb-dev terinstall
- [ ] User ditambahkan ke group lp dan dialout
- [ ] udev rules dibuat
- [ ] Logout & login ulang
- [ ] Printer terdeteksi dengan lsusb
- [ ] Node.js dependencies terinstall
- [ ] check-printers.js mendeteksi printer
- [ ] test-printer.js berhasil cetak
- [ ] Aplikasi berjalan normal
- [ ] Ambil nomor berhasil cetak struk

---

## 🆘 Support

Jika masih ada masalah:

1. **Cek logs:**
   ```bash
   dmesg | grep -i usb
   journalctl -xe
   ```

2. **Cek permissions:**
   ```bash
   groups $USER
   ls -l /dev/bus/usb/
   ```

3. **Test manual:**
   ```bash
   cd app
   node check-printers.js
   node test-printer.js
   ```

4. **Restart services:**
   ```bash
   sudo systemctl restart udev
   sudo udevadm trigger
   ```

---

## 📚 Referensi

- [escpos Documentation](https://github.com/song940/node-escpos)
- [libusb Documentation](https://libusb.info/)
- [udev Rules Guide](https://wiki.debian.org/udev)
- [systemd Service Guide](https://www.freedesktop.org/software/systemd/man/systemd.service.html)

---

**Setup selesai! Printer thermal siap digunakan di Linux/Ubuntu! 🎉**
