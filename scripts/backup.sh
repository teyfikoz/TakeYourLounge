#!/bin/bash
################################################################################
# TakeYourLounge - Automated Backup Script
#
# This script creates a complete backup of the TakeYourLounge application
# including source code, configurations, and SSL certificates.
#
# Usage: sudo ./backup.sh
# Cron: 0 3 * * * /var/www/TakeYourLounge/scripts/backup.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/TakeYourLounge"
BACKUP_DIR="/root/backups/takeyourlounge"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="takeyourlounge_backup_${DATE}.tar.gz"
RETENTION_DAYS=30  # Keep backups for 30 days

echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}   TakeYourLounge - Backup Script${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Error: This script must be run as root${NC}"
    echo "Usage: sudo ./backup.sh"
    exit 1
fi

# Create backup directory
echo -e "${YELLOW}Step 1: Creating backup directory...${NC}"
mkdir -p $BACKUP_DIR
echo -e "${GREEN}✓ Directory created: $BACKUP_DIR${NC}"
echo ""

# Stop PM2 (optional - for consistency)
echo -e "${YELLOW}Step 2: Stopping PM2 processes (optional)...${NC}"
read -p "Stop PM2 during backup? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    pm2 stop takeyourlounge
    echo -e "${GREEN}✓ PM2 stopped${NC}"
    PM2_STOPPED=true
else
    echo -e "${YELLOW}⊘ Continuing with PM2 running${NC}"
    PM2_STOPPED=false
fi
echo ""

# Backup application files
echo -e "${YELLOW}Step 3: Backing up application files...${NC}"
cd /var/www
tar -czf $BACKUP_DIR/$BACKUP_FILE \
  --exclude='TakeYourLounge/web/node_modules' \
  --exclude='TakeYourLounge/web/.next' \
  --exclude='TakeYourLounge/.git' \
  TakeYourLounge/

BACKUP_SIZE=$(du -h $BACKUP_DIR/$BACKUP_FILE | cut -f1)
echo -e "${GREEN}✓ Application backup created: $BACKUP_FILE ($BACKUP_SIZE)${NC}"
echo ""

# Backup Nginx configuration
echo -e "${YELLOW}Step 4: Backing up Nginx configuration...${NC}"
if [ -f /etc/nginx/sites-available/takeyourlounge.com ]; then
    cp /etc/nginx/sites-available/takeyourlounge.com \
      $BACKUP_DIR/nginx_takeyourlounge_${DATE}.conf
    echo -e "${GREEN}✓ Nginx config backed up${NC}"
else
    echo -e "${YELLOW}⊘ Nginx config not found${NC}"
fi
echo ""

# Backup PM2 configuration
echo -e "${YELLOW}Step 5: Backing up PM2 configuration...${NC}"
pm2 save
cp /root/.pm2/dump.pm2 $BACKUP_DIR/pm2_dump_${DATE}.pm2
echo -e "${GREEN}✓ PM2 config backed up${NC}"
echo ""

# Backup SSL certificates
echo -e "${YELLOW}Step 6: Backing up SSL certificates...${NC}"
if [ -d /etc/letsencrypt/live/takeyourlounge.com ]; then
    tar -czf $BACKUP_DIR/ssl_certificates_${DATE}.tar.gz \
      /etc/letsencrypt/live/takeyourlounge.com/ \
      /etc/letsencrypt/archive/takeyourlounge.com/ \
      /etc/letsencrypt/renewal/takeyourlounge.com.conf \
      2>/dev/null
    echo -e "${GREEN}✓ SSL certificates backed up${NC}"
else
    echo -e "${YELLOW}⊘ SSL certificates not found${NC}"
fi
echo ""

# Backup database (if using PostgreSQL/MySQL)
echo -e "${YELLOW}Step 7: Backing up database...${NC}"
# Currently using JSON files, no database backup needed
echo -e "${YELLOW}⊘ Using JSON files, no database to backup${NC}"
echo ""

# Restart PM2 (if stopped)
if [ "$PM2_STOPPED" = true ]; then
    echo -e "${YELLOW}Step 8: Restarting PM2...${NC}"
    pm2 start takeyourlounge
    echo -e "${GREEN}✓ PM2 restarted${NC}"
    echo ""
fi

# Clean old backups
echo -e "${YELLOW}Step 9: Cleaning old backups (older than $RETENTION_DAYS days)...${NC}"
DELETED=$(find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)
echo -e "${GREEN}✓ Deleted $DELETED old backup(s)${NC}"
echo ""

# Generate backup report
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}   Backup Completed Successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Backup Details:${NC}"
echo "  Date: $(date)"
echo "  Location: $BACKUP_DIR"
echo ""
echo -e "${YELLOW}Files Created:${NC}"
ls -lh $BACKUP_DIR/*_${DATE}* 2>/dev/null || echo "  No files"
echo ""
echo -e "${YELLOW}Disk Usage:${NC}"
df -h $BACKUP_DIR | tail -1
echo ""
echo -e "${YELLOW}Total Backups:${NC}"
echo "  $(ls -1 $BACKUP_DIR/*.tar.gz 2>/dev/null | wc -l) backup files"
echo ""

# Backup verification
echo -e "${YELLOW}Verifying backup integrity...${NC}"
if tar -tzf $BACKUP_DIR/$BACKUP_FILE > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backup integrity verified${NC}"
else
    echo -e "${RED}✗ Backup verification failed!${NC}"
    exit 1
fi
echo ""

# Success message
echo -e "${GREEN}✓ All backups completed successfully!${NC}"
echo ""
echo -e "${YELLOW}To restore from this backup:${NC}"
echo "  sudo ./restore.sh $BACKUP_FILE"
echo ""
echo -e "${YELLOW}To download backup to local machine:${NC}"
echo "  scp root@46.62.164.198:$BACKUP_DIR/$BACKUP_FILE ~/Backups/"
echo ""

# Log backup
echo "$(date) - Backup completed: $BACKUP_FILE" >> $BACKUP_DIR/backup.log

exit 0
