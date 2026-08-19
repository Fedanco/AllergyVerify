---
name: verify
description: Come buildare, lanciare e verificare AllergyVerify end-to-end nel browser
---

# Verifica AllergyVerify

SPA statica (Vite + React), nessun backend. Superficie: GUI browser.

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
Le route usano HashRouter: `http://localhost:4173/#/profile`, `#/product/<barcode>`, ecc.

## Flussi da coprire

1. **Profilo**: `#/profile` → nome + toggle pill allergeni (es. "🥛 Latte") → "Salva profilo". Persistito in localStorage (`as_profiles`, `as_active_profile`).
2. **Barcode reale**: dalla Search inserire `3017620422003` (Nutella: contiene latte + frutta a guscio) → naviga a `#/product/3017620422003` → banner rosso "Attenzione, …! Contiene: Latte, Frutta a guscio" + tabella nutrimenti.
3. **Ricerca testuale**: query non numerica (es. "biscotti") → lista risultati con card cliccabili.
4. **Storico**: `#/history` deve contenere i prodotti aperti.
5. **Probe not-found**: barcode `00000000000001` → messaggio "Nessun prodotto trovato".
6. **Scan**: in headless la camera non c'è → deve mostrare il fallback "fotocamera non disponibile/negata", non crashare.
7. **Lingua** (da v0.3.0): in `#/settings` i bottoni 🇮🇹/🇬🇧 hanno `aria-pressed`; il cambio deve tradurre la UI, persistere dopo reload (`localStorage as_lang`) e — su un prodotto non anglofono come `3017620425035` (Nutella FR) con lingua EN — mostrare gli ingredienti tradotti via MyMemory (indicatore "Traduzione…" transitorio, cache `as_ingredients_tr_v1:*`). Attendere ~400 ms dopo il click prima di asserzioni sui colori: `transition-colors` a metà transizione dà falsi negativi.

## Gotcha

- Le chiamate vanno direttamente a `world.openfoodfacts.org`: serve rete; i lookup barcode sono cachati 24h in localStorage (`as_product_cache_v3:*`), quindi per ritestare il fetch pulire lo storage.
- Il chunk dello scanner (zxing) è lazy: la pagina Scan mostra prima "Caricamento scanner…".
- **PWA/service worker** (da v0.2.0): la build genera `dist/sw.js` + `manifest.webmanifest`; il SW precache-a l'app shell, quindi dopo la prima visita un reload nello stesso context può servire file stale — per ritestare una nuova build usare un browser context fresco. Test offline: `ctx.setOffline(true)` + reload deve funzionare. `images.openfoodfacts.org` a volte è lentissimo (>15s): un'immagine prodotto vuota nello screenshot non è un bug.
- Per lo stato "scanning" della camera in headless: lanciare Chrome con `--use-fake-device-for-media-stream --use-fake-ui-for-media-stream` e `permissions: ['camera']`.
- Le safe area iOS (`env(safe-area-inset-*)`) valgono 0 in Chrome desktop: notch/status bar in standalone e le icone Home/Preferiti si verificano solo su iPhone reale dopo il deploy (iOS cachea le icone per URL: per vederne una nuova serve un nome file nuovo).
