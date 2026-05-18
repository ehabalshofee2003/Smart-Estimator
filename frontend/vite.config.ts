import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-i18next', 'i18next'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
        // لا تضع changeOrigin هنا أبداً
      },
      '/sanctum': {
        target: 'http://localhost:8080',
        secure: false,
        // لا تضع changeOrigin هنا أبداً
      }
    }
  }
})