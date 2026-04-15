import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:4000',
      '/projects': 'http://localhost:4000',
      '/invite': 'http://localhost:4000',
      '/payment': 'http://localhost:4000',
      '/upload': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000',
      '/health': 'http://localhost:4000',
    },
  },
})
