#!/bin/bash
# TakeYourLounge - Nginx & SSL Setup Script
# This script configures Nginx reverse proxy and installs SSL certificate

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

DOMAIN="takeyourlounge.com"
APP_PORT="3000"
NGINX_CONF="/etc/nginx/sites-available/takeyourlounge.com"
NGINX_ENABLED="/etc/nginx/sites-enabled/takeyourlounge.com"

echo -e "${GREEN}=== TakeYourLounge - Nginx & SSL Setup ===${NC}\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Step 1: Install dependencies
echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

# Step 2: Create certbot directory
echo -e "\n${YELLOW}Step 2: Creating certbot directory...${NC}"
mkdir -p /var/www/certbot

# Step 3: Copy Nginx configuration
echo -e "\n${YELLOW}Step 3: Setting up Nginx configuration...${NC}"
cp /var/www/TakeYourLounge/nginx/takeyourlounge.com.conf "$NGINX_CONF"

# Step 4: Create temporary HTTP-only config for SSL certificate
echo -e "\n${YELLOW}Step 4: Creating temporary HTTP config for SSL verification...${NC}"
cat > "$NGINX_CONF" << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name takeyourlounge.com www.takeyourlounge.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Step 5: Enable site
echo -e "\n${YELLOW}Step 5: Enabling Nginx site...${NC}"
ln -sf "$NGINX_CONF" "$NGINX_ENABLED"

# Step 6: Test Nginx configuration
echo -e "\n${YELLOW}Step 6: Testing Nginx configuration...${NC}"
nginx -t

# Step 7: Reload Nginx
echo -e "\n${YELLOW}Step 7: Reloading Nginx...${NC}"
systemctl reload nginx

# Step 8: Check if domain resolves
echo -e "\n${YELLOW}Step 8: Checking DNS resolution...${NC}"
if host "$DOMAIN" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Domain resolves correctly${NC}"

    # Step 9: Obtain SSL certificate
    echo -e "\n${YELLOW}Step 9: Obtaining SSL certificate from Let's Encrypt...${NC}"
    echo "This will ask for your email and agreement to terms of service."

    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
        --non-interactive \
        --agree-tos \
        --redirect \
        --email admin@"$DOMAIN" || {
        echo -e "${RED}SSL certificate installation failed. You can run it manually:${NC}"
        echo "certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    }

    # Step 10: Setup auto-renewal
    echo -e "\n${YELLOW}Step 10: Setting up auto-renewal...${NC}"
    systemctl enable certbot.timer
    systemctl start certbot.timer

    echo -e "\n${GREEN}=== Setup Complete! ===${NC}"
    echo -e "Your site is now available at:"
    echo -e "  ${GREEN}https://$DOMAIN${NC}"
    echo -e "\nSSL certificate will auto-renew."
    echo -e "\nTo check PM2 status: ${YELLOW}pm2 list${NC}"
    echo -e "To check Nginx status: ${YELLOW}systemctl status nginx${NC}"
    echo -e "To view logs: ${YELLOW}pm2 logs takeyourlounge${NC}"

else
    echo -e "${RED}⚠ Warning: Domain does not resolve to this server yet!${NC}"
    echo -e "Please update your DNS records first:"
    echo -e "  Type: A"
    echo -e "  Name: @"
    echo -e "  Value: $(curl -s ifconfig.me)"
    echo -e "  TTL: 300"
    echo ""
    echo -e "  Type: A"
    echo -e "  Name: www"
    echo -e "  Value: $(curl -s ifconfig.me)"
    echo -e "  TTL: 300"
    echo ""
    echo -e "After updating DNS, wait a few minutes and run:"
    echo -e "  ${YELLOW}certbot --nginx -d $DOMAIN -d www.$DOMAIN${NC}"
    echo ""
    echo -e "Site is currently accessible via HTTP at:"
    echo -e "  ${GREEN}http://$DOMAIN${NC}"
fi

echo -e "\n${GREEN}Script finished!${NC}"
