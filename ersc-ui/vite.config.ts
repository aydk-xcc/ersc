import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import type { Plugin } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isMockEnabled = process.env.USE_MOCK === 'true';
  
  const plugins: Plugin[] = [react()];
  
  // 只在 USE_MOCK=true 时添加 mock 插件
  if (isMockEnabled) {
    plugins.push(
      viteMockServe({
        mockPath: 'mock',
        enable: true,
        logger: true,
        supportTs: true,
        watchFiles: true
      })
    );
  }
  
  return {
    build: {
      sourcemap: true,
    },
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5173',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
