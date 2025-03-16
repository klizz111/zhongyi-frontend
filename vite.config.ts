import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://hk.klizz.asia:7777/api/translation',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 清除 /api 前缀避免路由冲突
      },
    },
    allowedHosts: [
      'hk.klizz.asia',
      'localhost',
      '127.0.0.1',
    ],
  },
})
