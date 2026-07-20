import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// base './' + HashRouter: funziona su hosting statico senza redirect 404
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AllergyScan',
        short_name: 'AllergyScan',
        description:
          'Scansiona i prodotti alimentari e scopri subito se contengono i tuoi allergeni.',
        lang: 'it',
        display: 'standalone',
        theme_color: '#0a0b0d',
        background_color: '#0a0b0d',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // include i font self-hosted (@fontsource) nel precache dell'app
        // shell, altrimenti al primo avvio offline il testo ripiegherebbe
        // silenziosamente su system-ui
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // foto prodotto: cache-first, il barcode identifica un'immagine stabile
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.openfoodfacts\.org\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'off-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
    }),
  ],
})
