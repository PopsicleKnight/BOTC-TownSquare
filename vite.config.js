import { fileURLToPath, URL } from 'node:url';
import path from 'node:path'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import server from './src/server/index';

import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const port = 3000;

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    outDir: './dist',
  },
  server: {
    port: port,
    proxy: {
      '/api': {
        target: `${server.host}:${server.port}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/socket.io': {
        target: `${server.host}:${server.port}`,
        ws: true, // Enable WebSocket proxying
      }
    },
  }
});
