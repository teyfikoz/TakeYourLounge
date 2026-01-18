module.exports = {
  apps: [{
    name: 'takeyourlounge',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/TakeYourLounge/web',
    instances: 1,
    exec_mode: 'fork',

    // Auto-restart on crash
    autorestart: true,
    watch: false,

    // Memory limit protection - restart if exceeds 1GB
    max_memory_restart: '1G',

    // Restart behavior
    max_restarts: 10,        // Max 10 restarts in min_uptime window
    min_uptime: '10s',       // App must run 10s to be considered stable
    restart_delay: 4000,     // Wait 4s before restart

    // Environment
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },

    // Logging
    error_file: '/var/log/pm2/takeyourlounge-error.log',
    out_file: '/var/log/pm2/takeyourlounge-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,

    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,

    // Cron restart - every day at 3 AM (optional)
    cron_restart: '0 3 * * *',
  }]
};
