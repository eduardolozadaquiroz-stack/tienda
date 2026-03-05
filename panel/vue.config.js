const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL || 'http://localhost:4201',
        changeOrigin: true
      }
    }
  }
});
