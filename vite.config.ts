import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          katex: ['katex'],
          flexsearch: ['flexsearch']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
