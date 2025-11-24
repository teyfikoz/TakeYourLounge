#!/bin/bash

# TakeYourLounge Hetzner Deployment Script
# Server: ubuntu-32gb-hel1-2
# IP: 46.62.164.198

echo "================================================"
echo "TakeYourLounge Hetzner Deployment Script"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Server details
SERVER_IP="46.62.164.198"
SERVER_USER="root"
PROJECT_NAME="takeyourlounge"
DOMAIN="takeyourlounge.com"

echo -e "${YELLOW}Step 1: Checking existing ports on server...${NC}"
echo ""
echo "Run this command on your Hetzner server:"
echo ""
echo "ssh root@46.62.164.198"
echo ""
echo "Then run these commands to check existing apps:"
echo ""
echo "# 1. Check Node.js processes"
echo "ps aux | grep node | grep -v grep"
echo ""
echo "# 2. Check PM2 processes"
echo "pm2 list"
echo ""
echo "# 3. Check listening ports"
echo "netstat -tulpn | grep LISTEN | grep -E ':(3[0-9]{3}|80|443|8080)'"
echo ""
echo "# 4. Check specific port range"
echo "lsof -i :3000-3010"
echo ""
echo -e "${GREEN}After checking ports, note which ports are FREE${NC}"
echo ""

read -p "Press Enter after you've checked the ports and chosen a free port..."

echo ""
echo -e "${YELLOW}What port did you choose?${NC}"
read -p "Enter available port (e.g., 3000, 3001, 3002): " CHOSEN_PORT

echo ""
echo -e "${GREEN}Using port: $CHOSEN_PORT${NC}"
echo ""

# Verify port
echo -e "${YELLOW}Step 2: Creating deployment script for server...${NC}"

# Create server deployment script
cat > /tmp/server_deploy.sh << 'SERVERSCRIPT'
#!/bin/bash

# Configuration
CHOSEN_PORT=__PORT__
PROJECT_DIR="/var/www/takeyourlounge"
REPO_URL="https://github.com/teyfikoz/TakeYourLounge.git"

echo "=== Installing dependencies if needed ==="
# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Installing Git..."
    apt-get update
    apt-get install -y git
fi

echo ""
echo "=== Node.js version ==="
node --version
npm --version
pm2 --version

echo ""
echo "=== Cloning project from GitHub ==="
mkdir -p /var/www
cd /var/www

# Remove old directory if exists
if [ -d "$PROJECT_DIR" ]; then
    echo "Removing old installation..."
    pm2 delete takeyourlounge 2>/dev/null || true
    rm -rf "$PROJECT_DIR"
fi

# Clone fresh
git clone "$REPO_URL" takeyourlounge
cd "$PROJECT_DIR/web"

echo ""
echo "=== Installing dependencies ==="
npm install

echo ""
echo "=== Building for production ==="
npm run build

echo ""
echo "=== Creating environment file ==="
cat > .env.production << 'ENV'
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-74NMEZ6BJT

# Production URL
NEXT_PUBLIC_SITE_URL=https://takeyourlounge.com

# Node environment
NODE_ENV=production
ENV

echo ""
echo "=== Creating PM2 ecosystem file ==="
cat > ecosystem.config.js << 'ECOSYSTEM'
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
      PORT: __PORT__
    },
    error_file: '/var/log/takeyourlounge/error.log',
    out_file: '/var/log/takeyourlounge/out.log',
    time: true
  }]
};
ECOSYSTEM

# Replace port placeholder
sed -i "s/__PORT__/$CHOSEN_PORT/g" ecosystem.config.js

echo ""
echo "=== Creating log directory ==="
mkdir -p /var/log/takeyourlounge
chmod 755 /var/log/takeyourlounge

echo ""
echo "=== Starting application with PM2 ==="
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

echo ""
echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== Testing local connection ==="
sleep 3
curl -I http://localhost:$CHOSEN_PORT || echo "Warning: Could not connect to app"

echo ""
echo "=== Deployment complete! ==="
echo "App is running on port: $CHOSEN_PORT"
echo "Next steps:"
echo "1. Configure Nginx reverse proxy"
echo "2. Set up SSL certificate"
echo "3. Update DNS if needed"
SERVERSCRIPT

# Replace port in script
sed "s/__PORT__/$CHOSEN_PORT/g" /tmp/server_deploy.sh > /tmp/server_deploy_final.sh
chmod +x /tmp/server_deploy_final.sh

echo ""
echo -e "${GREEN}=== Deployment script created! ===${NC}"
echo ""
echo "Now upload and run this script on your server:"
echo ""
echo -e "${YELLOW}Step 3: Upload script to server${NC}"
echo "scp /tmp/server_deploy_final.sh root@46.62.164.198:/root/"
echo ""
echo -e "${YELLOW}Step 4: SSH to server and run the script${NC}"
echo "ssh root@46.62.164.198"
echo "bash /root/server_deploy_final.sh"
echo ""
echo -e "${YELLOW}Step 5: After deployment, configure Nginx${NC}"
echo ""
echo "Create Nginx config: /etc/nginx/sites-available/takeyourlounge"
echo ""
echo "Use this configuration:"
echo ""
cat << NGINXCONF
upstream takeyourlounge_backend {
    server 127.0.0.1:$CHOSEN_PORT;
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

    ssl_certificate /etc/letsencrypt/live/takeyourlounge.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/takeyourlounge.com/privkey.pem;

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
}
NGINXCONF

echo ""
echo -e "${YELLOW}Step 6: Enable site and get SSL${NC}"
echo "ln -s /etc/nginx/sites-available/takeyourlounge /etc/nginx/sites-enabled/"
echo "nginx -t"
echo "systemctl reload nginx"
echo "certbot --nginx -d takeyourlounge.com -d www.takeyourlounge.com"
echo ""
echo -e "${GREEN}All set! Follow these steps to deploy.${NC}"
