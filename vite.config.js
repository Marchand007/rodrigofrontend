import { fileURLToPath, URL } from 'node:url'

import dotenv from 'dotenv';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  build: {
    target: 'es2018',
    outDir: 'dist',
    assetsDir: 'assets',
    // Ajoutez le format de sortie ici
    format: 'esm',
  },
})
