import { defineConfig } from 'vite';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: '.',
  publicDir: 'images',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          'vendor': ['jquery', 'bootstrap'],
        },
      },
    },
    commonjsOptions: {
      include: [/lib/, /node_modules/],
    },
    sourcemap: false, // Disable in production for smaller bundles
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'js'),
    },
    extensions: ['.js', '.json'],
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer,
      ],
    },
  },
  optimizeDeps: {
    include: ['jquery', 'bootstrap', 'clipboard', 'js-cookie'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
});
