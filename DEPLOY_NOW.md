# TakeYourLounge - Hetzner Deployment Komutları

**Sunucu:** ubuntu-32gb-hel1-2
**IP:** 46.62.164.198
**Kullanıcı:** root
**Şifre:** TE44iTuWX7gu

---

## ADIM 1: Sunucuya Bağlan ve Mevcut Portları Kontrol Et

Terminal'i aç ve şu komutu çalıştır:

```bash
ssh root@46.62.164.198
```

Şifre sorduğunda: `TE44iTuWX7gu`

### Mevcut Uygulamaları Kontrol Et

Sunucuya bağlandıktan sonra bu komutları sırayla çalıştır:

```bash
# Node.js uygulamalarını listele
echo "=== MEVCUT NODE.JS UYGULAMALARI ==="
ps aux | grep node | grep -v grep

# PM2 processlerini listele
echo -e "\n=== PM2 PROCESSES ==="
pm2 list 2>/dev/null || echo "PM2 kurulu değil veya process yok"

# Kullanılan portları göster
echo -e "\n=== KULLANILAN PORTLAR ==="
netstat -tulpn | grep LISTEN | sort

# 3000-3010 arası portları tek tek kontrol et
echo -e "\n=== PORT DURUMU (3000-3010) ==="
for port in {3000..3010}; do
  if lsof -i :$port &>/dev/null; then
    echo "❌ Port $port DOLU"
  else
    echo "✅ Port $port BOŞ"
  fi
done
```

**Hangi portlar boş? Bir tanesini seç (örn: 3000, 3001, 3002, vs.)**

---

## ADIM 2: Otomatik Deployment Script'i Çalıştır

Boş bir port seçtikten sonra (örneğin 3001), bu komutu çalıştır:

```bash
# Deployment klasörü oluştur
mkdir -p /root/deployment
cd /root/deployment

# Deployment script'i oluştur
cat > deploy_takeyourlounge.sh << 'EOFSCRIPT'
#!/bin/bash

# Configuration
echo "============================================"
echo "TakeYourLounge Deployment Script"
echo "============================================"
echo ""

# Port seçimi
echo "Hangi portu kullanmak istiyorsunuz?"
read -p "Port numarası (örn: 3000, 3001, 3002): " CHOSEN_PORT

echo ""
echo "✅ Port $CHOSEN_PORT seçildi"
echo ""

PROJECT_DIR="/var/www/takeyourlounge"
REPO_URL="https://github.com/teyfikoz/TakeYourLounge.git"

# Node.js kurulu mu kontrol et
if ! command -v node &> /dev/null; then
    echo "📦 Node.js kuruluyor..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "✅ Node.js zaten kurulu: $(node --version)"
fi

# PM2 kurulu mu kontrol et
if ! command -v pm2 &> /dev/null; then
    echo "📦 PM2 kuruluyor..."
    npm install -g pm2
else
    echo "✅ PM2 zaten kurulu: $(pm2 --version)"
fi

# Git kurulu mu kontrol et
if ! command -v git &> /dev/null; then
    echo "📦 Git kuruluyor..."
    apt-get update -qq
    apt-get install -y git
else
    echo "✅ Git zaten kurulu"
fi

# Eski kurulum varsa temizle
if [ -d "$PROJECT_DIR" ]; then
    echo "🧹 Eski kurulum temizleniyor..."
    pm2 delete takeyourlounge 2>/dev/null || true
    rm -rf "$PROJECT_DIR"
fi

# GitHub'dan projeyi clone et
echo "📥 GitHub'dan proje indiriliyor..."
mkdir -p /var/www
cd /var/www
git clone "$REPO_URL" takeyourlounge

if [ $? -ne 0 ]; then
    echo "❌ Git clone başarısız!"
    exit 1
fi

cd "$PROJECT_DIR/web"

# Dependencies kur
echo "📦 Dependencies kuruluyor..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install başarısız!"
    exit 1
fi

# Production build
echo "🔨 Production build yapılıyor..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build başarısız!"
    exit 1
fi

# Environment file oluştur
echo "⚙️  Environment file oluşturuluyor..."
cat > .env.production << 'ENVEOF'
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-74NMEZ6BJT

# Production URL
NEXT_PUBLIC_SITE_URL=https://takeyourlounge.com

# Node environment
NODE_ENV=production
ENVEOF

# PM2 ecosystem config oluştur
echo "⚙️  PM2 config oluşturuluyor..."
cat > ecosystem.config.js << ECOEOF
module.exports = {
  apps: [{
    name: 'takeyourlounge',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/takeyourlounge/web',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: ${CHOSEN_PORT}
    },
    error_file: '/var/log/takeyourlounge/error.log',
    out_file: '/var/log/takeyourlounge/out.log',
    time: true
  }]
};
ECOEOF

# Log klasörü oluştur
echo "📁 Log klasörü oluşturuluyor..."
mkdir -p /var/log/takeyourlounge
chmod 755 /var/log/takeyourlounge

# PM2 ile başlat
echo "🚀 Uygulama başlatılıyor..."
pm2 start ecosystem.config.js

# PM2'yi sistem başlangıcına ekle
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash

echo ""
echo "✅ Deployment tamamlandı!"
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🧪 Local test:"
sleep 3
curl -I http://localhost:${CHOSEN_PORT}

echo ""
echo "============================================"
echo "✅ TakeYourLounge başarıyla deploy edildi!"
echo "============================================"
echo ""
echo "Port: ${CHOSEN_PORT}"
echo "Dizin: /var/www/takeyourlounge/web"
echo ""
echo "Sıradaki adımlar:"
echo "1. Nginx yapılandırması"
echo "2. SSL sertifikası"
echo "3. Domain DNS kontrolü"
echo ""
echo "PM2 Komutları:"
echo "  pm2 status              - Status göster"
echo "  pm2 logs takeyourlounge - Logları göster"
echo "  pm2 restart takeyourlounge - Restart"
echo "  pm2 stop takeyourlounge - Durdur"
echo ""
EOFSCRIPT

# Script'i çalıştırılabilir yap
chmod +x deploy_takeyourlounge.sh

# Script'i çalıştır
bash deploy_takeyourlounge.sh
```

**Port sorduğunda boş bir port numarası gir (örn: 3001)**

---

## ADIM 3: Nginx Yapılandırması

Deployment başarılı olduktan sonra, Nginx'i yapılandır:

```bash
# Nginx kurulu mu kontrol et
if ! command -v nginx &> /dev/null; then
    echo "Nginx kuruluyor..."
    apt-get update
    apt-get install -y nginx
fi

# Seçtiğin portu değişkene ata (deployment'ta kullandığın port)
export APP_PORT=3001  # ⚠️ BURAYA SEÇTİĞİN PORTU YAZ!

# Nginx config oluştur
cat > /etc/nginx/sites-available/takeyourlounge << NGINXEOF
upstream takeyourlounge_backend {
    server 127.0.0.1:${APP_PORT};
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name takeyourlounge.com www.takeyourlounge.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name takeyourlounge.com www.takeyourlounge.com;

    # SSL sertifikaları (certbot tarafından oluşturulacak)
    ssl_certificate /etc/letsencrypt/live/takeyourlounge.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/takeyourlounge.com/privkey.pem;

    # SSL ayarları
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        proxy_pass http://takeyourlounge_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
    }

    location /_next/static/ {
        proxy_pass http://takeyourlounge_backend;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /sitemap.xml {
        proxy_pass http://takeyourlounge_backend;
        add_header Cache-Control "public, max-age=3600";
    }

    access_log /var/log/nginx/takeyourlounge_access.log;
    error_log /var/log/nginx/takeyourlounge_error.log;
}
NGINXEOF

# Site'ı aktif et
ln -sf /etc/nginx/sites-available/takeyourlounge /etc/nginx/sites-enabled/

# Default site'ı devre dışı bırak (çakışmayı önlemek için)
rm -f /etc/nginx/sites-enabled/default

# Nginx config test et
nginx -t

# Config başarılıysa Nginx'i reload et
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo "✅ Nginx yapılandırıldı!"
else
    echo "❌ Nginx config hatası!"
fi
```

---

## ADIM 4: SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kur
apt-get update
apt-get install -y certbot python3-certbot-nginx

# DNS'in doğru olduğunu kontrol et
echo "DNS kontrolü:"
dig +short takeyourlounge.com
dig +short www.takeyourlounge.com

# Her ikisi de 46.62.164.198 göstermeli!

# SSL sertifikası al
certbot --nginx -d takeyourlounge.com -d www.takeyourlounge.com --non-interactive --agree-tos --email teyfi@techsyncanalytica.com

# Auto-renewal test et
certbot renew --dry-run

echo "✅ SSL sertifikası kuruldu!"
```

---

## ADIM 5: DNS Kontrolü (GoDaddy)

GoDaddy'de DNS ayarlarını kontrol et:

1. [GoDaddy DNS Yönetimi](https://dcc.godaddy.com/control/takeyourlounge.com/dns)'ne git
2. Şu kayıtların olduğundan emin ol:

| Tip | Name | Value | TTL |
|-----|------|-------|-----|
| A | @ | 46.62.164.198 | 600 |
| A | www | 46.62.164.198 | 600 |

3. Eski kayıtları sil (forwarding, park, vs.)

---

## ADIM 6: Test Et!

```bash
# 1. Local test
curl -I http://localhost:3001  # veya seçtiğin port

# 2. HTTP test (redirect olmalı)
curl -I http://takeyourlounge.com

# 3. HTTPS test
curl -I https://takeyourlounge.com

# 4. PM2 status
pm2 status

# 5. Logs
pm2 logs takeyourlounge --lines 50

# 6. Nginx logs
tail -f /var/log/nginx/takeyourlounge_access.log
```

---

## ADIM 7: Browser'da Test Et

Browser'da şu adresleri aç:

- ✅ https://takeyourlounge.com
- ✅ https://www.takeyourlounge.com
- ✅ https://takeyourlounge.com/lounges
- ✅ https://takeyourlounge.com/airports
- ✅ https://takeyourlounge.com/sitemap.xml
- ✅ https://takeyourlounge.com/robots.txt

---

## Yararlı Komutlar

```bash
# PM2 komutları
pm2 status                    # Status
pm2 logs takeyourlounge       # Logs
pm2 restart takeyourlounge    # Restart
pm2 stop takeyourlounge       # Stop
pm2 delete takeyourlounge     # Delete

# Nginx komutları
nginx -t                      # Config test
systemctl status nginx        # Status
systemctl reload nginx        # Reload
systemctl restart nginx       # Restart

# SSL komutları
certbot certificates          # Sertifika bilgisi
certbot renew                 # Manuel renewal

# Log komutları
tail -f /var/log/takeyourlounge/error.log
tail -f /var/log/nginx/takeyourlounge_error.log
```

---

## Sorun Giderme

### Uygulama başlamıyor

```bash
# Logs kontrol et
pm2 logs takeyourlounge --err --lines 100

# Port çakışması var mı?
lsof -i :3001  # port numaranı yaz

# Manuel başlat
cd /var/www/takeyourlounge/web
PORT=3001 npm start
```

### Nginx 502 Bad Gateway

```bash
# App çalışıyor mu?
pm2 status
curl http://localhost:3001

# Nginx error log
tail -50 /var/log/nginx/takeyourlounge_error.log

# Upstream port doğru mu?
grep "127.0.0.1" /etc/nginx/sites-available/takeyourlounge
```

### SSL hatası

```bash
# Sertifika var mı?
ls -la /etc/letsencrypt/live/takeyourlounge.com/

# DNS doğru mu?
dig +short takeyourlounge.com

# Yeniden dene
certbot --nginx -d takeyourlounge.com -d www.takeyourlounge.com
```

---

## Özet

1. ✅ **Adım 1:** SSH bağlan, portları kontrol et, boş port seç
2. ✅ **Adım 2:** Deployment script'i çalıştır
3. ✅ **Adım 3:** Nginx yapılandır (portu güncelle!)
4. ✅ **Adım 4:** SSL sertifikası al
5. ✅ **Adım 5:** DNS kontrol et
6. ✅ **Adım 6:** Test et (curl)
7. ✅ **Adım 7:** Browser'da test et

**Tahmini Süre:** 20-30 dakika

---

🚀 **Başarılar!**
