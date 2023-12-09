import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import requireTransform from 'vite-plugin-require-transform';


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // 如果本地自己启动可以使用10.27.141.12:8180
        target: 'http://localhost:3000',  // 代理目标地址
        changeOrigin: true
      }
    }
  },
  plugins: [
    vue(),
    vueJsx(),
    requireTransform({
      fileRegex: /.js$|.vue$/
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    sourcemap: true
  }
})
