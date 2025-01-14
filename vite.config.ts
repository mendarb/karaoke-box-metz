import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

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
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover'],
          'forms': ['react-hook-form', '@hookform/resolvers'],
          'utils': ['date-fns', 'clsx', 'tailwind-merge'],
        }
      },
    },
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    sourcemap: mode === 'development',
  },
  plugins: [
    react({
      plugins: mode === 'production' ? [['swc-plugin-optimize-images', {}]] : [],
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
}));