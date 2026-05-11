import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  base: './', // Important: Use relative paths for WordPress
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/rainforest': {
        target: 'https://api.rainforestapi.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/rainforest/, ''),
        secure: true,
      },
      '/api/dataforseo': {
        target: 'https://api.dataforseo.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/dataforseo/, ''),
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})
