import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' + HashRouter: funziona su GitHub Pages senza redirect 404
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
