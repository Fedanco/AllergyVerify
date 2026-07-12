---
name: verify
description: Come buildare, lanciare e verificare AllergyScan Web end-to-end nel browser
---

# Verifica AllergyScan Web

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

Viewport mobile 390×844 per il layout principale, 1280×800 per la sidebar desktop.
Le route usano HashRouter: `http://localhost:4173/#/profile`, `#/product/<barcode>`, ecc.

## Flussi da coprire

1. **Profilo**: `#/profile` → nome + toggle pill allergeni (es. "🥛 Latte") → "Salva profilo". Persistito in localStorage (`as_profiles`, `as_active_profile`).
2. **Barcode reale**: dalla Search inserire `3017620422003` (Nutella: contiene latte + frutta a guscio) → naviga a `#/product/3017620422003` → banner rosso "Attenzione, …! Contiene: Latte, Frutta a guscio" + tabella nutrimenti.
3. **Ricerca testuale**: query non numerica (es. "biscotti") → lista risultati con card cliccabili.
4. **Storico**: `#/history` deve contenere i prodotti aperti.
5. **Probe not-found**: barcode `00000000000001` → messaggio "Nessun prodotto trovato".
6. **Scan**: in headless la camera non c'è → deve mostrare il fallback "fotocamera non disponibile/negata", non crashare.

## Gotcha

- Le chiamate vanno direttamente a `world.openfoodfacts.org`: serve rete; i lookup barcode sono cachati 24h in localStorage (`as_product_cache:*`), quindi per ritestare il fetch pulire lo storage.
- Il chunk dello scanner (zxing) è lazy: la pagina Scan mostra prima "Caricamento scanner…".
