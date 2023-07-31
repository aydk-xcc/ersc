import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import requireTransform from 'vite-plugin-require-transform';


// https://vitejs.dev/config/
export default defineConfig({
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
  },
  css: {
    preprocessorOptions: {
      less: {
        math: "always", // 括号内才使用数学计算
        globalVars: {
          // 全局变量
          mainColor: "red",
        },
      },
    },
  }
})
