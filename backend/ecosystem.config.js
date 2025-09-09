module.exports = {
  apps: [{
    name: 'udp-tracker-backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      UDP_PORT: 6001
    },
    error_file: '/var/log/pm2/udp-tracker-backend-error.log',
    out_file: '/var/log/pm2/udp-tracker-backend-out.log',
    log_file: '/var/log/pm2/udp-tracker-backend.log'
  }]
};
