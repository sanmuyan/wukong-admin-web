const path = require('path')
const fs = require('fs')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      fallback: {
        path: require.resolve('path-browserify')
      }
    }
  },
  devServer: {
    allowedHosts: ['all'],
    host: process.env.SERVER_HOST || 'localhost',
    port: process.env.SERVER_PORT || 8080,
    https: process.env.SSL_ON === 'yes',
    server: {
      options: {
        key: fs.readFileSync(path.resolve(__dirname, process.env.SSL_KEY_PATH)),
        cert: fs.readFileSync(path.resolve(__dirname, process.env.SSL_CERT_PATH))
      }
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  },
  chainWebpack (config) {
    config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
})
