# TakeYourLounge - Deployment & Maintenance Guide

## 📋 İçindekiler
1. [Proje Özeti](#proje-özeti)
2. [Son Geliştirmeler](#son-geliştirmeler)
3. [Teknik Mimari](#teknik-mimari)
4. [Deployment Süreci](#deployment-süreci)
5. [Backup & Restore](#backup--restore)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Proje Özeti

**TakeYourLounge** - Havalimanı lounge'larını keşfetmek için kapsamlı bir platform.

### İstatistikler
- **Toplam Lounge**: 2,256
- **Toplam Havalimanı**: 703
- **Toplam Sayfa**: 2,967 (statik olarak üretilmiş)
- **First Load JS**: 102 kB
- **Production URL**: https://takeyourlounge.com

### Teknoloji Stack
- **Frontend**: Next.js 15.5.6 (App Router)
- **TypeScript**: Strict mode
- **Styling**: Tailwind CSS
- **Analytics**: Google Analytics 4
- **Deployment**: PM2 + Nginx
- **Server**: Hetzner VPS (Ubuntu 24.04)
- **SSL**: Let's Encrypt (auto-renewal enabled)

---

## 🚀 Son Geliştirmeler

### 1. TypeScript Strict Mode Düzeltmeleri
**Tarih**: 25 Kasım 2025

#### Yapılan Değişiklikler:
- ✅ 15+ "implicit any" hatası düzeltildi
- ✅ Tüm callback parametreleri tiplendirildi
- ✅ Object.entries type casting düzeltildi
- ✅ Review type assertion düzeltildi
- ✅ trackVisitor function signature güncellendi

#### Etkilenen Dosyalar:
```
web/src/app/airports/page.tsx
web/src/app/airports/[code]/page.tsx
web/src/app/lounges/page.tsx
web/src/app/lounges/[id]/page.tsx
web/src/components/ReviewForm.tsx
web/src/lib/analytics.ts
web/src/lib/deviceId.ts
```

#### Örnek Düzeltme:
**Önce:**
```typescript
.map((lounge, index) => (
```

**Sonra:**
```typescript
.map((lounge: any, index: number) => (
```

### 2. PM2 Ecosystem Configuration
**Tarih**: 25 Kasım 2025

#### Oluşturulan Dosya:
`web/ecosystem.config.js`

#### Özellikler:
- Auto-restart enabled
- Memory limit: 1GB
- Port: 3000
- Production mode
- Cluster mode disabled (tek instance)

### 3. Nginx Reverse Proxy & SSL
**Tarih**: 25 Kasım 2025

#### Yapılandırma:
- Domain: takeyourlounge.com, www.takeyourlounge.com
- HTTP to HTTPS redirect
- Proxy to localhost:3000
- Gzip compression
- Security headers
- SSL/TLS certificate (Let's Encrypt)

#### Oluşturulan Dosyalar:
```
nginx/takeyourlounge.com.conf
nginx/setup-nginx-ssl.sh
```

### 4. Analytics & Tracking
**Tarih**: 25 Kasım 2025

#### Eklenen Özellikler:
- Device fingerprinting (`deviceId.ts`)
- Visitor tracking (`trackVisitor`)
- Review tracking (`hasReviewed`, `markAsReviewed`)
- Google Analytics 4 integration

### 5. Footer Güncellemesi
**Tarih**: 25 Kasım 2025

#### Değişiklik:
- ❌ GitHub linki kaldırıldı
- ✅ LinkedIn linki eklendi → https://techsyncanalytica.com
- ✅ "Tech Sync Analytica LLC" branding

---

## 🏗️ Teknik Mimari

### Sistem Bileşenleri

```
┌─────────────────────────────────────────────────────┐
│                   Internet                          │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│              Cloudflare (DNS)                       │
│         takeyourlounge.com → 46.62.164.198          │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│           Hetzner VPS (Ubuntu 24.04)                │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  Nginx (Reverse Proxy)                      │  │
│  │  - Port 80 → 443 redirect                   │  │
│  │  - Port 443 → localhost:3000                │  │
│  │  - SSL/TLS (Let's Encrypt)                  │  │
│  └─────────────────┬───────────────────────────┘  │
│                    │                                │
│                    ▼                                │
│  ┌─────────────────────────────────────────────┐  │
│  │  PM2 Process Manager                        │  │
│  │  - App: takeyourlounge                      │  │
│  │  - Port: 3000                               │  │
│  │  - Auto-restart: enabled                    │  │
│  └─────────────────┬───────────────────────────┘  │
│                    │                                │
│                    ▼                                │
│  ┌─────────────────────────────────────────────┐  │
│  │  Next.js Application                        │  │
│  │  - Static Site Generation (SSG)             │  │
│  │  - 2,967 pre-rendered pages                 │  │
│  │  - Client-side hydration                    │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Dosya Yapısı

```
/var/www/TakeYourLounge/
├── web/
│   ├── .next/                    # Build output
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── page.tsx         # Ana sayfa
│   │   │   ├── airports/        # Havalimanı sayfaları
│   │   │   ├── lounges/         # Lounge sayfaları
│   │   │   └── api/             # API routes
│   │   ├── components/          # React components
│   │   ├── data/                # JSON data files
│   │   │   ├── lounges.json    # 2,256 lounge
│   │   │   └── airports.json   # 703 havalimanı
│   │   ├── lib/                 # Utility functions
│   │   └── types/               # TypeScript types
│   ├── ecosystem.config.js      # PM2 configuration
│   ├── next.config.js           # Next.js config
│   ├── package.json             # Dependencies
│   └── tsconfig.json            # TypeScript config
├── nginx/
│   ├── takeyourlounge.com.conf  # Nginx site config
│   └── setup-nginx-ssl.sh       # SSL setup script
└── README.md
```

---

## 📦 Deployment Süreci

### İlk Kurulum (Yapıldı)

#### 1. Sunucuya Klonlama
```bash
cd /var/www
git clone https://github.com/teyfikoz/TakeYourLounge.git
cd TakeYourLounge/web
npm install
npm run build
```

#### 2. PM2 Yapılandırma
```bash
cd /var/www/TakeYourLounge/web
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 3. Nginx Kurulumu
```bash
cd /var/www/TakeYourLounge
sudo cp nginx/takeyourlounge.com.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/takeyourlounge.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. SSL Sertifikası
```bash
sudo certbot --nginx -d takeyourlounge.com -d www.takeyourlounge.com
```

### Güncellemeler (Normal Workflow)

#### Kod Değişikliği Sonrası Deployment:

```bash
# 1. Sunucuya bağlan
ssh root@46.62.164.198

# 2. Kod güncelle
cd /var/www/TakeYourLounge
git pull origin main

# 3. Dependencies güncelle (gerekirse)
cd web
npm install

# 4. Production build
npm run build

# 5. PM2 restart
pm2 restart takeyourlounge

# 6. Kontrol
pm2 list
pm2 logs takeyourlounge --lines 50
```

#### Hızlı Deployment Script:
```bash
#!/bin/bash
cd /var/www/TakeYourLounge
git pull origin main
cd web
npm install
npm run build
pm2 restart takeyourlounge
pm2 logs takeyourlounge --lines 20
```

---

## 💾 Backup & Restore

### 1. Tam Sistem Backup

#### Backup Alma (Sunucuda)
```bash
#!/bin/bash
# backup-takeyourlounge.sh

# Backup directory
BACKUP_DIR="/root/backups/takeyourlounge"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="takeyourlounge_backup_${DATE}.tar.gz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Stop PM2 (optional - for consistency)
# pm2 stop takeyourlounge

# Backup application files
cd /var/www
tar -czf $BACKUP_DIR/$BACKUP_FILE \
  --exclude='TakeYourLounge/web/node_modules' \
  --exclude='TakeYourLounge/web/.next' \
  TakeYourLounge/

# Backup Nginx config
sudo cp /etc/nginx/sites-available/takeyourlounge.com \
  $BACKUP_DIR/nginx_takeyourlounge_${DATE}.conf

# Backup PM2 config
pm2 save

# Backup SSL certificates
sudo tar -czf $BACKUP_DIR/ssl_certificates_${DATE}.tar.gz \
  /etc/letsencrypt/live/takeyourlounge.com/ \
  /etc/letsencrypt/archive/takeyourlounge.com/ \
  /etc/letsencrypt/renewal/takeyourlounge.com.conf

# Restart PM2 (if stopped)
# pm2 start takeyourlounge

echo "Backup completed: $BACKUP_DIR/$BACKUP_FILE"
ls -lh $BACKUP_DIR/$BACKUP_FILE
```

#### Backup'ı İndirme (Local)
```bash
# SCP ile backup'ı local'e indir
scp root@46.62.164.198:/root/backups/takeyourlounge/takeyourlounge_backup_*.tar.gz ~/Backups/

# veya rsync ile
rsync -avz root@46.62.164.198:/root/backups/takeyourlounge/ ~/Backups/takeyourlounge/
```

### 2. Veritabansız Sistem (Mevcut Durum)

**Not**: Şu an TakeYourLounge statik JSON dosyaları kullanıyor, veritabanı yok.

#### JSON Data Backup
```bash
# Data files backup
cd /var/www/TakeYourLounge/web/src/data
tar -czf ~/backups/takeyourlounge_data_$(date +%Y%m%d).tar.gz \
  lounges.json \
  airports.json
```

### 3. Otomatik Backup (Cron)

#### Günlük Backup Cron Job:
```bash
# Crontab'ı düzenle
sudo crontab -e

# Her gün saat 03:00'te backup al
0 3 * * * /root/scripts/backup-takeyourlounge.sh

# Her hafta Pazar günü 04:00'te eski backupları temizle (30 günden eski)
0 4 * * 0 find /root/backups/takeyourlounge -name "*.tar.gz" -mtime +30 -delete
```

### 4. Restore İşlemi

#### Tam Restore:
```bash
#!/bin/bash
# restore-takeyourlounge.sh

BACKUP_FILE="/root/backups/takeyourlounge/takeyourlounge_backup_20251125_190000.tar.gz"

# Stop application
pm2 stop takeyourlounge

# Backup current state (safety)
cd /var/www
tar -czf /root/backups/takeyourlounge/pre-restore-backup_$(date +%Y%m%d_%H%M%S).tar.gz TakeYourLounge/

# Remove old files
rm -rf /var/www/TakeYourLounge

# Restore from backup
cd /var/www
tar -xzf $BACKUP_FILE

# Reinstall dependencies
cd /var/www/TakeYourLounge/web
npm install

# Rebuild
npm run build

# Restart
pm2 start ecosystem.config.js
pm2 save

echo "Restore completed!"
pm2 list
```

### 5. GitHub Backup (Otomatik)

Repository zaten GitHub'da yedekli:
```
https://github.com/teyfikoz/TakeYourLounge
```

Tüm kod değişiklikleri commit edilmiş durumda.

---

## 📊 Monitoring & Maintenance

### PM2 Monitoring

#### Durum Kontrolü:
```bash
# Tüm uygulamaları listele
pm2 list

# Detaylı bilgi
pm2 show takeyourlounge

# Memory & CPU kullanımı
pm2 monit

# Real-time logs
pm2 logs takeyourlounge

# Son 100 log satırı
pm2 logs takeyourlounge --lines 100

# Hata logları
pm2 logs takeyourlounge --err
```

#### PM2 Restart Strategies:
```bash
# Graceful restart
pm2 restart takeyourlounge

# Hard restart
pm2 reload takeyourlounge

# Stop
pm2 stop takeyourlounge

# Start
pm2 start takeyourlounge

# Delete from PM2
pm2 delete takeyourlounge
```

### Nginx Monitoring

#### Log Dosyaları:
```bash
# Access logs
sudo tail -f /var/log/nginx/takeyourlounge.access.log

# Error logs
sudo tail -f /var/log/nginx/takeyourlounge.error.log

# Tüm Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Son 100 request
sudo tail -100 /var/log/nginx/takeyourlounge.access.log
```

#### Nginx Kontrol:
```bash
# Configuration test
sudo nginx -t

# Reload (zero downtime)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# Status
sudo systemctl status nginx

# Nginx version
nginx -v
```

### SSL Certificate Monitoring

#### Sertifika Bilgisi:
```bash
# Expiry date kontrolü
sudo certbot certificates

# Manuel renewal (test)
sudo certbot renew --dry-run

# Force renewal (30 günden az kaldıysa)
sudo certbot renew --force-renewal

# Auto-renewal status
sudo systemctl status certbot.timer
```

#### Sertifika Süresi Kontrolü:
```bash
# OpenSSL ile kontrol
echo | openssl s_client -servername takeyourlounge.com -connect takeyourlounge.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Disk Kullanımı

```bash
# Genel disk kullanımı
df -h

# TakeYourLounge klasörü boyutu
du -sh /var/www/TakeYourLounge

# .next build cache
du -sh /var/www/TakeYourLounge/web/.next

# node_modules boyutu
du -sh /var/www/TakeYourLounge/web/node_modules

# Log dosyaları boyutu
du -sh /var/log/nginx
du -sh /root/.pm2/logs
```

### Memory & CPU

```bash
# System resources
htop

# veya
top

# Memory kullanımı
free -h

# PM2 processes memory
pm2 list

# Detaylı process info
ps aux | grep node
```

---

## 🔧 Troubleshooting

### Problem 1: Site Yüklenmiyor

#### Adımlar:
```bash
# 1. PM2 durumu kontrol et
pm2 list
# Status "online" olmalı

# 2. PM2 logs kontrol et
pm2 logs takeyourlounge --lines 50
# Error var mı?

# 3. Nginx status
sudo systemctl status nginx
# Active (running) olmalı

# 4. Nginx error logs
sudo tail -50 /var/log/nginx/error.log

# 5. Port 3000 dinleniyor mu?
sudo netstat -tlnp | grep 3000
# veya
sudo lsof -i :3000

# 6. Curl ile test
curl -I http://localhost:3000
curl -I http://takeyourlounge.com
```

#### Çözüm:
```bash
# PM2 restart
pm2 restart takeyourlounge

# Nginx reload
sudo systemctl reload nginx

# Son çare: rebuild
cd /var/www/TakeYourLounge/web
npm run build
pm2 restart takeyourlounge
```

### Problem 2: SSL Hatası

#### Adımlar:
```bash
# 1. Sertifika kontrolü
sudo certbot certificates

# 2. Nginx SSL config
cat /etc/nginx/sites-available/takeyourlounge.com | grep ssl

# 3. Sertifika dosyaları var mı?
ls -la /etc/letsencrypt/live/takeyourlounge.com/

# 4. Renewal test
sudo certbot renew --dry-run
```

#### Çözüm:
```bash
# Sertifikayı yeniden al
sudo certbot --nginx -d takeyourlounge.com -d www.takeyourlounge.com --force-renewal
```

### Problem 3: Build Hatası

#### Adımlar:
```bash
# 1. TypeScript errors
cd /var/www/TakeYourLounge/web
npm run build 2>&1 | tee build.log

# 2. Node version
node --version
# v18+ olmalı

# 3. Dependencies
npm install

# 4. Cache temizle
rm -rf .next
npm run build
```

### Problem 4: Port Çakışması

#### Adımlar:
```bash
# Port 3000'i kim kullanıyor?
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# PM2 restart
pm2 restart takeyourlounge
```

### Problem 5: Memory Yetersiz

#### Adımlar:
```bash
# Memory kullanımı
free -h

# PM2 memory limit artır
# ecosystem.config.js dosyasında:
max_memory_restart: '2G'  # 1G'den 2G'ye

# PM2 restart
pm2 restart takeyourlounge
```

### Problem 6: Diğer Siteler Çalışmıyor

#### Adımlar:
```bash
# Tüm enabled siteler
ls -la /etc/nginx/sites-enabled/

# Her sitenin config'ini test et
sudo nginx -t

# Specific site disable et (test için)
sudo rm /etc/nginx/sites-enabled/takeyourlounge.com
sudo systemctl reload nginx

# Enable geri
sudo ln -s /etc/nginx/sites-available/takeyourlounge.com /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

---

## 📈 Performance Optimization

### Next.js Build Optimization

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export (şu an kullanılmıyor)

  // Image optimization
  images: {
    unoptimized: true, // Nginx cache kullanıyoruz
  },

  // Compression
  compress: true,

  // Production optimizations
  swcMinify: true,

  // Generate sitemap
  async generateBuildId() {
    return 'build-' + Date.now()
  }
}

module.exports = nextConfig
```

### Nginx Caching

Mevcut config'te:
- Static files: 1 year cache
- Images: 30 days cache
- Gzip compression aktif

### PM2 Cluster Mode (Opsiyonel)

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'takeyourlounge',
    script: 'npm',
    args: 'start',
    instances: 2, // CPU core sayısına göre
    exec_mode: 'cluster',
    // ...
  }]
}
```

---

## 🔐 Security Checklist

### Mevcut Güvenlik Önlemleri:
- ✅ SSL/TLS (HTTPS)
- ✅ Nginx security headers
- ✅ PM2 auto-restart
- ✅ Firewall (UFW recommended)
- ✅ SSH key authentication (recommended)
- ✅ Regular backups
- ✅ Git version control

### Önerilen Ek Güvenlik:

```bash
# 1. UFW Firewall
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable

# 2. Fail2ban (brute force protection)
sudo apt install fail2ban
sudo systemctl enable fail2ban

# 3. Auto security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📞 Support & Contact

### Geliştirici:
**Tech Sync Analytica LLC**
- Website: https://techsyncanalytica.com
- Repository: https://github.com/teyfikoz/TakeYourLounge

### Sunucu Bilgileri:
- **Provider**: Hetzner
- **Server**: ubuntu-32gb-hel1-2
- **IP**: 46.62.164.198
- **OS**: Ubuntu 24.04.3 LTS
- **Location**: Helsinki, Finland

### Önemli URL'ler:
- **Production**: https://takeyourlounge.com
- **GitHub**: https://github.com/teyfikoz/TakeYourLounge

---

## 📚 Ek Kaynaklar

### Next.js Documentation:
- https://nextjs.org/docs

### PM2 Documentation:
- https://pm2.keymetrics.io/docs/

### Nginx Documentation:
- https://nginx.org/en/docs/

### Let's Encrypt:
- https://letsencrypt.org/docs/

---

**Son Güncelleme**: 25 Kasım 2025
**Versiyon**: 1.0.0
**Deployment Status**: ✅ Production Ready
