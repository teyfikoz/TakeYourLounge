# Hetzner VPS Deployment Guide for TakeYourLounge

Complete guide for deploying **TakeYourLounge** Next.js application to your existing Hetzner VPS server.

---

## Prerequisites

✅ Hetzner VPS with SSH access
✅ Domain: takeyourlounge.com (pointed to Hetzner IP)
✅ Existing applications on server (need to avoid port conflicts)
✅ Node.js 18+ installed on server
✅ Nginx installed
✅ SSL certificate tool (certbot) installed

---

## STEP 1: Check Existing Applications & Ports

**CRITICAL:** Before deployment, identify which ports are already in use to avoid conflicts.

### 1.1 Connect to Hetzner Server

```bash
ssh root@YOUR_HETZNER_IP
# Or use your custom user
ssh your_username@YOUR_HETZNER_IP
```

### 1.2 Check All Running Applications

```bash
# List all Node.js processes
ps aux | grep node

# List all running services
systemctl list-units --type=service --state=running | grep -E 'node|pm2'

# Check PM2 processes (if using PM2)
pm2 list
```

### 1.3 Check Which Ports Are in Use

```bash
# Show all listening ports
sudo netstat -tulpn | grep LISTEN

# Or use ss command (modern alternative)
sudo ss -tulpn | grep LISTEN

# Check specific port ranges
sudo lsof -i :3000-3010
```

**Common Port Assignments:**
- **80** - HTTP (Nginx)
- **443** - HTTPS (Nginx)
- **3000** - Default Next.js dev
- **3001-3010** - Custom Node apps
- **5432** - PostgreSQL
- **6379** - Redis
- **27017** - MongoDB

### 1.4 Document Your Current Setup

Create a quick inventory:

```bash
# Create deployment notes
echo "EXISTING APPS ON HETZNER" > ~/deployment_notes.txt
echo "=========================" >> ~/deployment_notes.txt
echo "" >> ~/deployment_notes.txt

# Add running processes
echo "Running Node Apps:" >> ~/deployment_notes.txt
pm2 list >> ~/deployment_notes.txt 2>&1

# Add listening ports
echo -e "\nListening Ports:" >> ~/deployment_notes.txt
sudo netstat -tulpn | grep LISTEN >> ~/deployment_notes.txt

# View the file
cat ~/deployment_notes.txt
```

### 1.5 Choose Available Port for TakeYourLounge

**Recommended ports:**
- **3000** - If available (default Next.js)
- **3001** - Common alternative
- **8080** - Alternative HTTP port
- **3100** - Another good choice

**Selected Port:** _____ (fill this in after checking)

---

## STEP 2: Prepare Local Build

### 2.1 Create Production Environment File

On your **local machine**, create production env file:

```bash
cd ~/Downloads/TAKE_YOUR_LOUNGE/web
```

Create `.env.production`:

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-74NMEZ6BJT

# Google Sheets API (optional - for visitor tracking)
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id

# Production URL
NEXT_PUBLIC_SITE_URL=https://takeyourlounge.com
```

### 2.2 Test Production Build Locally

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Visit http://localhost:3000 to verify
# Press Ctrl+C when done
```

**Check for build errors:**
- TypeScript errors
- Missing dependencies
- Image optimization issues
- API route problems

### 2.3 Create Deployment Package

```bash
# Return to project root
cd ~/Downloads/TAKE_YOUR_LOUNGE

# Create tarball (excluding node_modules)
tar -czf takeyourlounge-deploy.tar.gz \
  --exclude='web/node_modules' \
  --exclude='web/.next' \
  --exclude='*.pyc' \
  --exclude='__pycache__' \
  --exclude='.git' \
  web/ data/

# Check file size
ls -lh takeyourlounge-deploy.tar.gz
```

---

## STEP 3: Upload to Hetzner Server

### 3.1 Transfer Files via SCP

```bash
# Upload deployment package
scp takeyourlounge-deploy.tar.gz root@YOUR_HETZNER_IP:/root/

# Or to specific user directory
scp takeyourlounge-deploy.tar.gz your_username@YOUR_HETZNER_IP:~/
```

### 3.2 SSH into Server and Extract

```bash
# Connect to server
ssh root@YOUR_HETZNER_IP

# Create project directory
mkdir -p /var/www/takeyourlounge
cd /var/www/takeyourlounge

# Extract files
tar -xzf ~/takeyourlounge-deploy.tar.gz

# Verify structure
ls -la
# Should see: web/ data/
```

---

## STEP 4: Install Dependencies on Server

### 4.1 Check Node.js Version

```bash
node --version
# Should be v18 or higher

npm --version
```

**If Node.js not installed or outdated:**

```bash
# Install Node.js 20 LTS (recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
```

### 4.2 Install Production Dependencies

```bash
cd /var/www/takeyourlounge/web

# Install dependencies
npm ci --production

# Or if you need dev dependencies for building
npm install

# Build on server
npm run build
```

### 4.3 Create Production Environment Variables

```bash
cd /var/www/takeyourlounge/web

# Create .env.production (or .env.local)
nano .env.production
```

Paste your environment variables:
```env
NEXT_PUBLIC_GA_ID=G-74NMEZ6BJT
NEXT_PUBLIC_SITE_URL=https://takeyourlounge.com
# ... other vars
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## STEP 5: Set Up Process Manager (PM2)

PM2 keeps your Node.js app running and restarts it on crashes.

### 5.1 Install PM2 (if not already installed)

```bash
npm install -g pm2

# Verify
pm2 --version
```

### 5.2 Create PM2 Ecosystem File

```bash
cd /var/www/takeyourlounge/web
nano ecosystem.config.js
```

Add this configuration:

```javascript
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
      PORT: 3000  // ⚠️ CHANGE THIS if port 3000 is taken!
    },
    error_file: '/var/log/takeyourlounge/error.log',
    out_file: '/var/log/takeyourlounge/out.log',
    time: true
  }]
};
```

**IMPORTANT:** Set `PORT` to your available port from Step 1.5!

### 5.3 Create Log Directory

```bash
sudo mkdir -p /var/log/takeyourlounge
sudo chown -R $USER:$USER /var/log/takeyourlounge
```

### 5.4 Start Application with PM2

```bash
cd /var/www/takeyourlounge/web

# Start app
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs takeyourlounge --lines 50

# Enable startup on boot
pm2 startup systemd
# Follow the command it outputs

# Save PM2 process list
pm2 save
```

### 5.5 Verify App is Running

```bash
# Check if app is listening on your port (e.g., 3000)
curl http://localhost:3000

# Should return HTML content
```

---

## STEP 6: Configure Nginx Reverse Proxy

### 6.1 Create Nginx Site Configuration

```bash
sudo nano /etc/nginx/sites-available/takeyourlounge
```

Add this configuration:

```nginx
# Upstream Node.js app
upstream takeyourlounge_backend {
    server 127.0.0.1:3000;  # ⚠️ Match your PM2 port!
    keepalive 64;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name takeyourlounge.com www.takeyourlounge.com;

    # Certbot challenge directory
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name takeyourlounge.com www.takeyourlounge.com;

    # SSL certificates (will be generated by certbot)
    ssl_certificate /etc/letsencrypt/live/takeyourlounge.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/takeyourlounge.com/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # Next.js static files (_next/static)
    location /_next/static/ {
        proxy_pass http://takeyourlounge_backend;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Next.js image optimization
    location /_next/image {
        proxy_pass http://takeyourlounge_backend;
        proxy_cache_valid 200 60m;
    }

    # Static files (images, fonts, etc.)
    location /images/ {
        proxy_pass http://takeyourlounge_backend;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # Main proxy to Next.js
    location / {
        proxy_pass http://takeyourlounge_backend;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Disable buffering for faster response
        proxy_buffering off;
    }

    # Sitemap
    location = /sitemap.xml {
        proxy_pass http://takeyourlounge_backend;
        add_header Cache-Control "public, max-age=3600";
    }

    # Robots.txt
    location = /robots.txt {
        proxy_pass http://takeyourlounge_backend;
        add_header Cache-Control "public, max-age=3600";
    }

    # Logs
    access_log /var/log/nginx/takeyourlounge_access.log;
    error_log /var/log/nginx/takeyourlounge_error.log;
}
```

**IMPORTANT:** Update `server 127.0.0.1:3000;` to match your chosen port!

### 6.2 Enable Site Configuration

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/takeyourlounge /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

## STEP 7: Set Up SSL Certificate (Let's Encrypt)

### 7.1 Install Certbot (if not installed)

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### 7.2 Verify DNS is Pointing to Server

```bash
# Check A record
dig +short takeyourlounge.com

# Check www subdomain
dig +short www.takeyourlounge.com

# Should both return your Hetzner server IP
```

**If DNS not pointing:**
1. Log in to GoDaddy
2. Go to DNS settings for takeyourlounge.com
3. Add/Update A records:
   - **@** → Your Hetzner IP
   - **www** → Your Hetzner IP
4. Wait 10-60 minutes for propagation

### 7.3 Obtain SSL Certificate

```bash
# Option 1: Automatic Nginx integration (recommended)
sudo certbot --nginx -d takeyourlounge.com -d www.takeyourlounge.com

# Option 2: Manual certificate only
sudo certbot certonly --nginx -d takeyourlounge.com -d www.takeyourlounge.com
```

**Follow the prompts:**
1. Enter email address
2. Agree to Terms of Service
3. Choose whether to share email with EFF
4. Select "Redirect" when asked (forces HTTPS)

### 7.4 Verify SSL Certificate

```bash
# Check certificate expiry
sudo certbot certificates

# Test auto-renewal
sudo certbot renew --dry-run
```

### 7.5 Set Up Auto-Renewal

Certbot should automatically create a cron job. Verify:

```bash
sudo systemctl status certbot.timer

# Or check cron
sudo crontab -l | grep certbot
```

---

## STEP 8: Configure Domain DNS (GoDaddy)

### 8.1 Log in to GoDaddy Account

1. Go to [https://www.godaddy.com](https://www.godaddy.com)
2. Sign in
3. Go to **"My Products"** → **"Domains"**
4. Click **"DNS"** next to takeyourlounge.com

### 8.2 Update DNS Records

**Current Records:**
| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_HETZNER_IP | 600 |
| A | www | YOUR_HETZNER_IP | 600 |
| CNAME | www | @ | 1 Hour |

**Remove any conflicting records** (old A records, forwarding, etc.)

### 8.3 Wait for DNS Propagation

```bash
# Check propagation globally
nslookup takeyourlounge.com
nslookup www.takeyourlounge.com

# Or use online tool:
# https://www.whatsmydns.net/#A/takeyourlounge.com
```

**Typical propagation time:** 10-60 minutes

---

## STEP 9: Test Production Deployment

### 9.1 Test HTTP (before SSL)

```bash
curl http://takeyourlounge.com
# Should redirect to HTTPS or return content
```

### 9.2 Test HTTPS (after SSL)

```bash
curl https://takeyourlounge.com
# Should return HTML content

# Check SSL certificate
curl -vI https://takeyourlounge.com 2>&1 | grep -i "subject:"
```

### 9.3 Test in Browser

Open browser and visit:
- ✅ https://takeyourlounge.com
- ✅ https://www.takeyourlounge.com
- ✅ http://takeyourlounge.com (should redirect to HTTPS)
- ✅ https://takeyourlounge.com/lounges
- ✅ https://takeyourlounge.com/airports
- ✅ https://takeyourlounge.com/sitemap.xml
- ✅ https://takeyourlounge.com/robots.txt

### 9.4 Check Google Analytics

Visit site and check:
1. GA4 Real-Time report: [https://analytics.google.com](https://analytics.google.com)
2. Should see active users

### 9.5 Check Visitor Tracking

```bash
# Monitor PM2 logs
pm2 logs takeyourlounge --lines 100 | grep -i "track"

# Check for Google Sheets API calls
```

---

## STEP 10: Performance Optimization

### 10.1 Enable HTTP/2

Already enabled in Nginx config: `listen 443 ssl http2;`

### 10.2 Configure Image Optimization

Next.js automatically optimizes images. Verify `next.config.js`:

```bash
cat /var/www/takeyourlounge/web/next.config.js
```

Should include:
```javascript
images: {
  domains: ['images.pexels.com'],
  formats: ['image/avif', 'image/webp'],
}
```

### 10.3 Set Up Log Rotation

```bash
sudo nano /etc/logrotate.d/takeyourlounge
```

Add:
```
/var/log/takeyourlounge/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 10.4 Monitor Resource Usage

```bash
# Check memory usage
pm2 monit

# Check disk usage
df -h

# Check server load
htop
```

---

## STEP 11: Security Hardening

### 11.1 Configure Firewall (UFW)

```bash
# Install UFW
sudo apt install ufw -y

# Allow SSH (CRITICAL - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 11.2 Disable PM2 Web Interface (if enabled)

```bash
pm2 web
# If it shows a port, disable it:
pm2 kill
pm2 start ecosystem.config.js
```

### 11.3 Set File Permissions

```bash
# Set ownership
sudo chown -R www-data:www-data /var/www/takeyourlounge

# Set directory permissions
sudo find /var/www/takeyourlounge -type d -exec chmod 755 {} \;

# Set file permissions
sudo find /var/www/takeyourlounge -type f -exec chmod 644 {} \;
```

---

## STEP 12: Monitoring & Maintenance

### 12.1 Set Up Basic Monitoring

```bash
# Check app status
pm2 status

# View logs
pm2 logs takeyourlounge

# Check Nginx logs
sudo tail -f /var/log/nginx/takeyourlounge_access.log
sudo tail -f /var/log/nginx/takeyourlounge_error.log
```

### 12.2 Common PM2 Commands

```bash
# Restart app
pm2 restart takeyourlounge

# Stop app
pm2 stop takeyourlounge

# Delete app
pm2 delete takeyourlounge

# Reload app (zero-downtime)
pm2 reload takeyourlounge

# View detailed info
pm2 show takeyourlounge
```

### 12.3 Update Application

When you need to update code:

```bash
# 1. Local: Build new version
npm run build
tar -czf takeyourlounge-update.tar.gz web/.next

# 2. Upload to server
scp takeyourlounge-update.tar.gz root@YOUR_IP:/tmp/

# 3. Server: Extract and reload
cd /var/www/takeyourlounge
tar -xzf /tmp/takeyourlounge-update.tar.gz
pm2 reload takeyourlounge
```

---

## Troubleshooting

### Issue 1: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Fix:**
```bash
# Find what's using the port
sudo lsof -i :3000

# Kill the process
sudo kill -9 PID

# Or choose a different port in ecosystem.config.js
```

### Issue 2: PM2 App Not Starting

**Error:** App status shows "errored"

**Fix:**
```bash
# Check logs
pm2 logs takeyourlounge --err --lines 50

# Common causes:
# - Missing dependencies: npm install
# - Wrong directory: check cwd in ecosystem.config.js
# - Port conflict: change PORT in env
# - Build not completed: npm run build
```

### Issue 3: Nginx 502 Bad Gateway

**Error:** Browser shows "502 Bad Gateway"

**Fix:**
```bash
# Check if app is running
pm2 status

# Check Nginx upstream
curl http://localhost:3000

# Check Nginx error log
sudo tail -f /var/log/nginx/takeyourlounge_error.log

# Verify upstream port matches in Nginx config
```

### Issue 4: SSL Certificate Not Working

**Error:** "Your connection is not private"

**Fix:**
```bash
# Check certificate status
sudo certbot certificates

# Regenerate if expired
sudo certbot renew

# Check Nginx SSL paths
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Issue 5: Domain Not Resolving

**Error:** "This site can't be reached"

**Fix:**
```bash
# Check DNS propagation
dig +short takeyourlounge.com

# Flush local DNS cache (on Mac)
sudo dscacheutil -flushcache

# Wait for propagation (up to 48 hours, usually < 1 hour)
```

---

## Quick Reference Checklist

### Pre-Deployment:
- [ ] Check existing apps and ports on Hetzner
- [ ] Build locally and test (`npm run build && npm start`)
- [ ] Create `.env.production` file
- [ ] Create deployment package

### Deployment:
- [ ] Upload files to server
- [ ] Extract to `/var/www/takeyourlounge`
- [ ] Install dependencies (`npm ci --production`)
- [ ] Build on server (`npm run build`)
- [ ] Configure PM2 with available port
- [ ] Start app with PM2
- [ ] Configure Nginx reverse proxy
- [ ] Obtain SSL certificate with certbot
- [ ] Update GoDaddy DNS records

### Post-Deployment:
- [ ] Test HTTPS access in browser
- [ ] Verify sitemap.xml works
- [ ] Check Google Analytics tracking
- [ ] Submit sitemap to Google Search Console
- [ ] Enable PM2 startup on boot
- [ ] Configure firewall (UFW)
- [ ] Set up log rotation

### Ongoing:
- [ ] Monitor PM2 logs weekly
- [ ] Check Nginx logs for errors
- [ ] Verify SSL auto-renewal
- [ ] Update dependencies monthly
- [ ] Monitor Google Analytics
- [ ] Review Search Console reports

---

## Port Assignment Example

If your server already has:
- Port 3000: Existing app A
- Port 3001: Existing app B

Then assign:
- **Port 3002** for TakeYourLounge

Update in 2 places:
1. `ecosystem.config.js`: `env.PORT: 3002`
2. `/etc/nginx/sites-available/takeyourlounge`: `server 127.0.0.1:3002;`

---

## Summary

**Deployment Time Estimate:**
- File transfer: 5-10 minutes
- Installation: 10-15 minutes
- Configuration: 15-20 minutes
- SSL setup: 5-10 minutes
- Testing: 10-15 minutes
- **Total: 45-70 minutes**

**Monthly Costs:**
- Hetzner VPS: ~€5-20 (existing)
- Domain: ~$15/year (existing)
- SSL: Free (Let's Encrypt)
- **Additional cost: €0**

**Performance:**
- Static generation: ~3,000 pages pre-rendered
- First load: < 1s
- Subsequent loads: < 200ms
- SEO score: 95+

---

✨ **Ready for production deployment!**

For support, check:
- Next.js docs: https://nextjs.org/docs
- PM2 docs: https://pm2.keymetrics.io/docs
- Nginx docs: https://nginx.org/en/docs
- Let's Encrypt: https://letsencrypt.org/docs
