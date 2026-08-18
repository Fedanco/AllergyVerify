import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa'

// base './' + HashRouter: funziona su hosting statico senza redirect 404
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    // HTTPS con certificato autofirmato, solo con `npm run dev:https`.
    // Serve per provare l'app dal telefono via IP di rete: la fotocamera (e
    // crypto.randomUUID) esistono solo in "secure context", cioè https o
    // localhost, quindi in http lo scanner non è nemmeno richiedibile.
    // Non è il default perché il certificato autofirmato costringe ogni
    // browser a un avviso di sicurezza da accettare a mano.
    ...(mode === 'https' ? [basicSsl()] : []),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AllergyVerify',
        short_name: 'AllergyVerify',
        description:
          'Scan food products and instantly find out whether they contain your allergens.',
        lang: 'en',
        display: 'standalone',
        theme_color: '#0b1017',
        background_color: '#0b1017',
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
}))
