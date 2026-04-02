import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  root: 'src',
  base: '/',
  server: {
    port: 5173,
    open: true,
    hmr: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2020',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@modules': path.resolve(__dirname, './src/ts/modules'),
      '@types': path.resolve(__dirname, './src/ts/types'),
      '@utils': path.resolve(__dirname, './src/ts/utils.ts')
    }
  },
  optimizeDeps: {
    include: ['@fortawesome/fontawesome-free']
  }
})
