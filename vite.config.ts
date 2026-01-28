import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  base: '/ram/',
  plugins: [react(), svgr()],
  build: {
    outDir: 'dist'
  },
  server: {
    port:3000,
    hmr: {
      overlay: false
    },
  }
})
