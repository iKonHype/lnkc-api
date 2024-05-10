module.exports = {
  apps: [
    {
      name: 'lnkc-backend', // Replace with your actual service name
      script: 'dist/main.js', // Replace with your actual backend service script
      instances: 1, // You can adjust the number of instances as needed
      autorestart: true,
      watch: false, // Set to true if you want PM2 to watch for file changes and auto-restart
      max_memory_restart: '3G', // Adjust the maximum memory usage for restarts as needed
      env: {
        NODE_ENV: 'production', // Set your desired environment variables
      },
      exec_mode: 'fork', // Set to fork if you want to run your service in a separate process
    },
  ],
};
