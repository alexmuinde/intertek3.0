import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. Import Tailwind v4 plugin

// https://vite.dev
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', 
        secure: false
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(), // 2. Add it to the plugins array
  ],
})
