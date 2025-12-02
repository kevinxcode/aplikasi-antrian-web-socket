# Deploy ke Ubuntu Server dengan Docker

## Persiapan Server Ubuntu

1. Install Docker dan Docker Compose:
```bash
# Update package
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Tambahkan user ke docker group
sudo usermod -aG docker $USER
newgrp docker
```

## Deploy Aplikasi

1. Upload file ke server (gunakan SCP, SFTP, atau Git):
```bash
# Jika menggunakan Git
git clone <repository-url>
cd 1.antrial-app

# Atau upload manual dengan SCP
scp -r /path/to/1.antrial-app user@server-ip:/home/user/
```

2. Build dan jalankan container:
```bash
cd 1.antrial-app
docker-compose up -d --build
```

Struktur folder:
```
1.antrial-app/
├── docker-compose.yml
├── app/
│   ├── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── public/
│       ├── index.html
│       └── display.html
```

3. Cek status container:
```bash
docker-compose ps
docker-compose logs -f
```

4. Akses aplikasi:
- Admin: http://server-ip:3000
- Display: http://server-ip:3000/display

## Perintah Docker Compose

```bash
# Start aplikasi
docker-compose up -d

# Stop aplikasi
docker-compose down

# Restart aplikasi
docker-compose restart

# Lihat logs
docker-compose logs -f

# Rebuild dan restart
docker-compose up -d --build

# Stop dan hapus container + image
docker-compose down --rmi all
```

## Menggunakan Port Lain

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Ganti 8080 dengan port yang diinginkan
```

## Menggunakan Nginx Reverse Proxy (Opsional)

Install Nginx:
```bash
sudo apt install nginx -y
```

Buat konfigurasi Nginx `/etc/nginx/sites-available/antrian`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan konfigurasi:
```bash
sudo ln -s /etc/nginx/sites-available/antrian /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Troubleshooting

Jika port 3000 sudah digunakan:
```bash
# Cek port yang digunakan
sudo netstat -tulpn | grep 3000

# Atau gunakan port lain di docker-compose.yml
```

Jika container error:
```bash
# Lihat logs detail
docker-compose logs

# Masuk ke container
docker exec -it antrian-app sh
```
