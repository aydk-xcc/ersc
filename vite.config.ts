import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), new MonacoEditorWebpackPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
