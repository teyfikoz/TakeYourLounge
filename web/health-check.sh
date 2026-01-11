#!/bin/bash
# TakeYourLounge Health Check Script
# Bu script her 5 dakikada bir çalışır ve siteyi kontrol eder
# Sorun varsa otomatik olarak PM2'yi restart eder

SITE_URL="http://localhost:3000"
LOG_FILE="/var/log/takeyourlounge-health.log"
MAX_RETRIES=3

# Create log directory if not exists
mkdir -p $(dirname "$LOG_FILE")

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_site() {
    local retry=0

    while [ $retry -lt $MAX_RETRIES ]; do
        # Check if site returns 200
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" --max-time 10)

        if [ "$HTTP_CODE" = "200" ]; then
            log "✓ Site is healthy (HTTP $HTTP_CODE)"
            return 0
        fi

        retry=$((retry + 1))
        log "⚠ Site check failed (HTTP $HTTP_CODE), retry $retry/$MAX_RETRIES"
        sleep 2
    done

    return 1
}

restart_pm2() {
    log "⚠ Site is down! Restarting PM2..."

    # Restart PM2
    pm2 restart takeyourlounge

    # Wait for startup
    sleep 10

    # Check if restart worked
    if check_site; then
        log "✓ PM2 restart successful, site is back online"

        # Send notification (optional - you can add email/slack here)
        return 0
    else
        log "✗ PM2 restart failed, manual intervention required"

        # Try rebuilding (last resort)
        log "⚠ Attempting full rebuild..."
        cd /var/www/TakeYourLounge/web
        rm -rf .next
        NODE_OPTIONS="--max-old-space-size=4096" npm run build
        pm2 restart takeyourlounge

        sleep 15

        if check_site; then
            log "✓ Full rebuild successful"
        else
            log "✗ Full rebuild failed - CRITICAL"
        fi
    fi
}

# Main execution
if ! check_site; then
    restart_pm2
fi
