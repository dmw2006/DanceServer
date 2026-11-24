module.exports = {
  apps: [
    {
      name: 'dance-backend',
      script: 'npm',
      args: 'start',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      restartDelay: 5000,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
      },
      log_file: './logs/dance-backend.log',
      out_file: './logs/dance-backend-out.log',
      error_file: './logs/dance-backend-error.log',
      time: true,
    },
  ],
};
