import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  plugins: [],
  build: {
    outDir: 'dist',
    target: 'es2015',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    open: false
  },
  preview: {
    port: 4173,
    host: '127.0.0.1'
  },
  optimizeDeps: {
    include: []
  }
})
