import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      clientPort: 443,
      host: 'reservation-kbox.netlify.app'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['/src/components/home/BookingSection.tsx'],
        },
      },
    },
  },
  plugins: [react()],
}));