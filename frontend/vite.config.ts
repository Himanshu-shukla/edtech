import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// vite.config.ts
import { viteStaticCopy } from 'vite-plugin-static-copy';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/.well-known/*',
          dest: '.well-known'
        }
      ]
    })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries into their own chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-ui': ['react-hot-toast', 'typewriter-effect'],
          'vendor-utils': ['d3-geo'],
          // Remove Three.js from manual chunking to allow true lazy loading
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    allowedHosts: ['edtech-b3xr.onrender.com', 'localhost', '127.0.0.1'],
    proxy: {
      // Proxy all API requests to backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  }
})
