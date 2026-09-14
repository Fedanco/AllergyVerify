import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa'

// Due pagine nello stesso build: la landing alla radice (`index.html`) e
// l'app in `app/index.html`, servita su /app/. L'app resta una SPA con
// HashRouter (/app/#/scan), quindi nessun rewrite lato server è necessario.
// La base è assoluta ('/'): con una entry annidata la base relativa './'
// avrebbe fatto puntare manifest e icone a /app/manifest.webmanifest.
export default defineConfig(({ mode }) => ({
  base: '/',
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        landing: 'index.html',
        privacy: 'privacy/index.html',
        terms: 'terms/index.html',
        app: 'app/index.html',
      },
    },
  },
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
        // L'app vive su /app/: la landing alla radice non fa parte della
        // webapp installata. `id` fisso così Chrome riconosce la stessa app
        // anche se start_url cambiasse ancora.
        id: '/app/',
        start_url: '/app/',
        scope: '/app/',
        display: 'standalone',
        theme_color: '#0b1017',
        background_color: '#0b1017',
        icons: [
          { src: 'pwa-192-v2.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512-v2.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512-v2.png',
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        // L'anteprima social serve solo ai crawler: non va scaricata da ogni
        // telefono che installa l'app.
        globIgnores: ['og-v1.png'],
        // Navigazioni sotto /app non in precache (es. /app senza barra
        // finale) cadono sull'app. L'allowlist è indispensabile: senza, anche
        // "/?x=1" finiva sull'app, perché una query non prevista non trova la
        // landing nel precache e scatta il fallback.
        navigateFallback: 'app/index.html',
        navigateFallbackAllowlist: [/^\/app(\/|$)/],
        // Qualunque query string trova comunque la pagina nel precache.
        ignoreURLParametersMatching: [/.*/],
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
