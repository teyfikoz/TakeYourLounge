# 🚀 TakeYourLounge - VPS Deployment Strategy

Hetzner VPS + GoDaddy Domain için deployment rehberi.

---

## 📊 **DEPLOYMENT SEÇENEKLERİ:**

### **Option 1: Static Export (ÖNERİLEN)**
```
✅ En hızlı
✅ En ucuz (Nginx sadece)
✅ CDN friendly
✅ 2,272 lounge → Static HTML
```

### **Option 2: Docker + Next.js SSR**
```
✅ Dynamic features
✅ API routes
⚠️  Daha fazla resource
```

### **Option 3: Vercel (Alternatif)**
```
✅ Zero config
✅ Auto scaling
✅ Free tier yeterli
⚠️  Vendor lock-in
```

---

## 🏗️ **HETZNER VPS SETUP (Option 1 - Static)**

### **1. VPS Gereksinimleri:**
```
CPU: 2 vCPU
RAM: 4 GB
Disk: 40 GB SSD
OS: Ubuntu 22.04 LTS
```

### **2. Initial Server Setup:**

```bash
# SSH ile bağlan
ssh root@your-vps-ip

# System update
apt update && apt upgrade -y

# Install Nginx
apt install nginx -y

# Install Node.js (for build)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Git
apt install git -y

# Install certbot (SSL)
apt install certbot python3-certbot-nginx -y
```

### **3. Clone & Build Project:**

```bash
# Clone repo
cd /var/www
git clone https://github.com/teyfikoz/TakeYourLounge.git
cd TakeYourLounge/web

# Install dependencies
npm install

# Build static export
npm run build
npm run export  # Creates /out directory

# Move to nginx
mv out /var/www/takeyourlounge
```

### **4. Nginx Configuration:**

```bash
# Create config
nano /etc/nginx/sites-available/takeyourlounge

# Add this:
server {
    listen 80;
    server_name takeyourlounge.com www.takeyourlounge.com;

    root /var/www/takeyourlounge;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main location
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 404 handling
    error_page 404 /404.html;
}

# Enable site
ln -s /etc/nginx/sites-available/takeyourlounge /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### **5. SSL Certificate (Free):**

```bash
# Get SSL
certbot --nginx -d takeyourlounge.com -d www.takeyourlounge.com

# Auto-renewal (already enabled)
systemctl status certbot.timer
```

### **6. GoDaddy Domain Setup:**

```
1. Login to GoDaddy
2. DNS Management
3. Add A Records:
   - Host: @ → Points to: YOUR_VPS_IP
   - Host: www → Points to: YOUR_VPS_IP
4. Wait 15-30 minutes for propagation
```

---

## 🐳 **HETZNER VPS SETUP (Option 2 - Docker)**

### **1. Install Docker:**

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y
```

### **2. Create Dockerfile:**

```dockerfile
# In /var/www/TakeYourLounge/web/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

### **3. Docker Compose:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: ./web
    ports:
      - "3000:3000"
    restart: always
    environment:
      - NODE_ENV=production

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - web
    restart: always
```

### **4. Deploy:**

```bash
cd /var/www/TakeYourLounge
docker-compose up -d --build
```

---

## 📈 **PERFORMANCE OPTIMIZATION:**

### **1. Enable Compression:**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### **2. CDN (Cloudflare - Free):**
```
1. Add site to Cloudflare
2. Update GoDaddy nameservers
3. Enable Auto-minify + Brotli
4. Enable Caching
```

### **3. Image Optimization:**
```bash
# Next.js handles this automatically
# But you can also use:
npm install sharp
```

---

## 🔒 **SECURITY:**

### **1. Firewall:**
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

### **2. Fail2Ban:**
```bash
apt install fail2ban -y
systemctl enable fail2ban
```

### **3. Auto-Updates:**
```bash
apt install unattended-upgrades -y
dpkg-reconfigure -plow unattended-upgrades
```

---

## 🔄 **CONTINUOUS DEPLOYMENT:**

### **1. Setup Deploy Script:**

```bash
# /var/www/deploy.sh
#!/bin/bash
cd /var/www/TakeYourLounge
git pull origin main
cd web
npm install
npm run build
npm run export
rm -rf /var/www/takeyourlounge/*
cp -r out/* /var/www/takeyourlounge/
systemctl reload nginx
echo "Deployed at $(date)" >> /var/log/deploy.log
```

### **2. GitHub Webhook (Optional):**
```bash
# Install webhook listener
npm install -g webhook
# Configure webhook on GitHub
# Point to: http://your-vps-ip:9000/hooks/deploy
```

---

## 💰 **COST COMPARISON:**

### **Hetzner VPS:**
```
CX21 (2 vCPU, 4GB RAM): €5.83/month (~$6.50)
+ Domain (GoDaddy): ~$12/year
= ~$90/year
```

### **Vercel:**
```
Free tier:
- 100 GB bandwidth/month
- Unlimited static sites
- Custom domain
= $0/year

Pro tier (if needed):
- $20/month = $240/year
```

**ÖNERİ:** Başlangıçta Vercel free tier, büyüyünce Hetzner VPS.

---

## 🎯 **NEXT.JS STATIC EXPORT SETUP:**

### **Update next.config.js:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static export
  images: {
    unoptimized: true  // Required for static export
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

### **Update package.json:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next export",
    "deploy": "next build && next export",
    "start": "next start"
  }
}
```

### **Build & Deploy:**

```bash
npm run deploy
# Creates /out directory with static files
```

---

## ✅ **DEPLOYMENT CHECKLIST:**

- [ ] VPS provisioned (Hetzner CX21)
- [ ] SSH key setup
- [ ] Nginx installed
- [ ] SSL certificate (Let's Encrypt)
- [ ] GoDaddy DNS configured
- [ ] Project cloned & built
- [ ] Static files in /var/www/takeyourlounge
- [ ] Nginx config tested
- [ ] Firewall configured
- [ ] Monitoring setup (optional)
- [ ] Backup strategy (optional)

---

## 📞 **TROUBLESHOOTING:**

### **Issue: Domain not resolving**
```bash
# Check DNS
dig takeyourlounge.com
nslookup takeyourlounge.com
```

### **Issue: Nginx not serving**
```bash
# Check logs
tail -f /var/log/nginx/error.log
nginx -t
```

### **Issue: SSL not working**
```bash
# Renew certificate
certbot renew --dry-run
```

---

*Created: November 22, 2025*
