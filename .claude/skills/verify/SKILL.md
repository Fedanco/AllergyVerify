---
name: verify
description: Come buildare, lanciare e verificare AllergyVerify end-to-end nel browser
---

# Verifica AllergyVerify

Due pagine nello stesso build (Vite multi-page), nessun backend. Superficie: GUI browser.

- **Landing** alla radice: `http://localhost:4173/` (codice in `src/landing/`, CSS e token propri).
- **App** (SPA con HashRouter) su `http://localhost:4173/app/`: tutte le route sotto sono
  `http://localhost:4173/app/#/profile`, `#/product/<barcode>`, ecc.

## Build e lancio

```bash
npm run build            # tsc -b && vite build (deve passare senza errori)
npm run preview -- --port 4173   # serve dist/ su http://localhost:4173
```

Dev server con HMR: `npm run dev` (porta 5173).

## Come guidarla (headless)

Playwright con Chrome di sistema (niente download browser):

```js
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
```

Se `playwright-core` manca: `npm install --no-save playwright-core`. Lo script di verifica
va eseguito **dalla root del progetto** (o copiato lì): da una cartella esterna l'import
fallisce con `ERR_MODULE_NOT_FOUND` perché non risolve il `node_modules` del progetto.

Viewport mobile 390×844 per il layout principale, 1280×800 per la sidebar desktop.
Le route dell'app usano HashRouter sotto `/app/`: `http://localhost:4173/app/#/profile`,
`/app/#/product/<barcode>`, ecc. Un link vecchio come `http://localhost:4173/#/profile`
deve redirigere a `/app/#/profile` (script inline nell'`index.html` della landing).

## Flussi da coprire

0. **Landing** (da v0.7.0): `/` mostra la landing (titolo "Read the label. Before the bite."), i due bottoni "Open the app" portano a `/app/`; lo switch `it`/`en` cambia i testi e persiste in `as_lang`, che l'app legge; a 400px di larghezza nessuno scroll orizzontale. `/?og` mostra solo la card 1200×630 per l'anteprima social. `/privacy/` e `/terms/` sono le pagine legali della landing (stessi testi dell'app, da `src/i18n/legal.ts`); i link nel footer devono portare lì, non a `/app/#/privacy`.
1. **Profilo**: `/app/#/profile` → nome + toggle pill allergeni (es. "🥛 Latte") → "Salva profilo". Persistito in localStorage (`as_profiles`, `as_active_profile`).
2. **Barcode reale**: dalla Search inserire `3017620422003` (Nutella: contiene latte + frutta a guscio) → naviga a `#/product/3017620422003` → cartellino rosa con timbro rosso CONTIENE, titolo "Attenzione, …!" e le etichette Latte e Frutta a guscio + ingredienti con gli allergeni sottolineati in rosso + tabella nutrimenti.
3. **Ricerca testuale**: query non numerica (es. "biscotti") → lista risultati con card cliccabili.
4. **Storico**: `#/history` deve contenere i prodotti aperti.
5. **Probe not-found**: barcode `00000000000001` → messaggio "Nessun prodotto trovato".
6. **Scan**: in headless la camera non c'è → deve mostrare il fallback "fotocamera non disponibile/negata", non crashare.
7. **Lingua** (da v0.3.0): in `#/settings` i bottoni 🇮🇹/🇬🇧 hanno `aria-pressed`; il cambio deve tradurre la UI, persistere dopo reload (`localStorage as_lang`) e — su un prodotto non anglofono come `3017620425035` (Nutella FR) con lingua EN — mostrare gli ingredienti tradotti via MyMemory (indicatore "Traduzione…" transitorio, cache `as_ingredients_tr_v1:*`). Attendere ~400 ms dopo il click prima di asserzioni sui colori: `transition-colors` a metà transizione dà falsi negativi.

## Gotcha

- Le chiamate vanno direttamente a `world.openfoodfacts.org`: serve rete; i lookup barcode sono cachati 24h in localStorage (`as_product_cache_v3:*`), quindi per ritestare il fetch pulire lo storage.
- Il chunk dello scanner (zxing) è lazy: la pagina Scan mostra prima "Caricamento scanner…".
- **PWA/service worker** (da v0.2.0): la build genera `dist/sw.js` + `manifest.webmanifest`; il SW precache-a l'app shell (landing compresa), quindi dopo la prima visita un reload nello stesso context può servire file stale — per ritestare una nuova build usare un browser context fresco, oppure da console `navigator.serviceWorker.getRegistrations()` → `unregister()` + `caches.keys()` → `caches.delete()`. Il manifest ha `start_url`/`scope` su `/app/`; il fallback di navigazione vale solo sotto `/app`. Test offline: `ctx.setOffline(true)` + reload deve funzionare. `images.openfoodfacts.org` a volte è lentissimo (>15s): un'immagine prodotto vuota nello screenshot non è un bug.
- Per lo stato "scanning" della camera in headless: lanciare Chrome con `--use-fake-device-for-media-stream --use-fake-ui-for-media-stream` e `permissions: ['camera']`.
- Le safe area iOS (`env(safe-area-inset-*)`) valgono 0 in Chrome desktop: notch/status bar in standalone e le icone Home/Preferiti si verificano solo su iPhone reale dopo il deploy (iOS cachea le icone per URL: per vederne una nuova serve un nome file nuovo).
