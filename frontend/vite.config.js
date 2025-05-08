import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
  }
})