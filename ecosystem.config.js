module.exports = {
  apps: [
    {
      name: 'vue3-admin',
      script: 'vue3-admin-server.js'
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '127.0.0.1',
      ref: 'origin/main',
      path: '/workspace/vue3-admin',
      'post-deploy': 'git reset --hard && git checkout main && git pull && npm i --production=false && pm2 startOrReload ecosystem.config.js', // -production=false 下载全量包
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}
