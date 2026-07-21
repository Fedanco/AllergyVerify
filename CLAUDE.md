# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Versione web dell'app iOS AllergyScan: scansiona il barcode di un prodotto alimentare (fotocamera o ricerca manuale) e verifica se contiene allergeni pericolosi per i profili configurati. SPA statica (Vite + React + TypeScript), nessun backend: tutti i dati utente vivono in `localStorage`.

## Contesto utente

- L'utente si chiama **Valentina**, parla **italiano** — rispondere sempre in italiano.
- Account GitHub: **Fedanco** (email git: fancona27@gmail.com).
- Tutto deve essere **gratuito** (hosting, API, servizi).
- Non è esperta di terminale: per operazioni interattive (login, comandi da lanciare a mano) dare istruzioni **passo-passo**.
- Approccio iterativo: prima una versione funzionante, poi migliorare in base al feedback.
- Design voluto: **dark-first / moderno-tech** (distacco esplicito dal vecchio look iOS).

## Comandi

- `npm run dev` — dev server con HMR su http://localhost:5173
- `npm run build` — `tsc -b && vite build`; deve passare senza errori TypeScript prima di ogni push
- `npm run preview -- --port 4173` — serve la build di `dist/` per test locali (route con `HashRouter`, es. `http://localhost:4173/#/profile`)
- `npm run lint` — oxlint (plugin react/typescript/oxc)
- Nessun test automatizzato configurato. Verifica end-to-end manuale in browser: vedi `.claude/skills/verify/SKILL.md` per la checklist dei flussi da coprire (barcode reale, ricerca testuale, storico, PWA offline, fallback fotocamera).

## Architettura

- **Routing**: `HashRouter` (`src/App.tsx`), scelto per funzionare su hosting statico senza redirect 404 lato server. Route: `/` (Search), `/scan` (lazy-loaded — zxing pesa ~400 kB, caricato solo aprendo lo scanner), `/history`, `/profile`, `/settings`, `/product/:code`.
- **Data flow prodotto** (`src/api/openFoodFacts.ts`): `getProductByBarcode` / `searchProducts` chiamano Open Food Facts con un set ridotto di `fields`. Cache a due livelli — `Map` in memoria + `localStorage` (prefisso `as_product_cache_v2:`, TTL 24h). Cambiando i `fields` richiesti va incrementato il suffisso di versione del prefisso; le voci con prefisso vecchio (`OLD_CACHE_PREFIXES`) vengono ripulite automaticamente al boot.
- **Stato persistente senza backend**: `useAllergyProfile` (`as_profiles`, `as_active_profile`) e `useScanHistory` (`as_history`, max 50 voci) sono store esterni basati su `useSyncExternalStore` con stato a livello di modulo e un `Set` di listener — un singleton condiviso tra componenti, non React Context. Nuovi store persistenti dovrebbero seguire lo stesso pattern.
- **Multilingua IT/EN** (`src/i18n/`): nessuna libreria — `useLang` è uno store `useSyncExternalStore` (chiave `as_lang`, default `it`) che ritorna `{ lang, setLang, t }`; `translations.ts` è l'unico dizionario, con `it` come sorgente e `en: Translations` verificato dal compilatore (chiave mancante = errore di build). Le voci con interpolazione sono funzioni `(x) => string`. Le etichette allergeni stanno in `allergenCatalog.ts` come `label: { it, en }`; `labelForTag(tag, lang)` richiede la lingua. Switcher lingua in `SettingsPage`.
- **Traduzione ingredienti** (`src/api/translate.ts`): il testo ingredienti segue la lingua dell'app. Si usa direttamente l'etichetta originale se `product.lang` coincide con la lingua app, o il campo `ingredients_text_it` per l'italiano; altrimenti si traduce dall'originale con MyMemory (gratuita, senza chiave, `langpair=autodetect|<target>`, chunk ~450 char, cache `as_ingredients_tr_v1:<lang>:<barcode>` TTL 30gg, fallback silenzioso all'originale). **Non fidarsi di `ingredients_text_en` di OFF per prodotti non anglofoni**: spesso è OCR spazzatura (verificato su Nutella FR 3017620425035).
- **Focus/tap**: `-webkit-tap-highlight-color: transparent` globale + utility `focus-ring` (`index.css`) che mostra un anello accent solo su `:focus-visible`; va aggiunta ai nuovi elementi interattivi.
- **Matching allergeni** (`src/data/allergenCatalog.ts`): catalogo fisso dei 14 allergeni regolamentati UE (tag OFF senza prefisso lingua + label italiana + emoji). `normalizeTag` strips il prefisso `xx:` dai tag OFF; `matchAllergens` interseca i tag del prodotto con gli allergeni del profilo attivo.
- **Tono del verdetto** (`src/lib/allergyTone.ts`): mappa condivisa `Tone` (`danger`/`warn`/`safe`/`neutral`) → icona/colore testo/superficie tonale/glow, usata sia da `AllergyBanner` (verdetto principale) sia da `ProfilesVerdict` (confronto multi-profilo) così le due UI non possono disallinearsi sui colori. Il glow (`TONE_GLOW`) è riservato a `danger`/`safe`: mai su `warn`/`neutral`, altrimenti smette di segnalare "verdetto vero" e diventa decorazione.
- **`ProductDetailPage`** è la pagina centrale: fetch per barcode, salvataggio nello storico (sorgente `scan` vs `search` dedotta da `location.state.fromScan`), e composizione di `ScoreStrip` (Nutri-Score/NOVA/Green-Score), `AllergyBanner`, `ProfilesVerdict` (confronto multi-profilo quando ci sono ≥2 profili), tabella nutrimenti con pallini di livello (basso/moderato/alto da `nutrient_levels` OFF), `IngredientsCard`.
- **PWA** (`vite-plugin-pwa` in `vite.config.ts`): manifest + service worker `autoUpdate`, cache-first per le immagini prodotto (`images.openfoodfacts.org`). Il SW precache-a l'app shell: dopo una nuova build, un reload nello stesso browser context può servire ancora file stale (serve un context/profilo fresco per ritestare). **iOS cachea le apple-touch-icon per URL**: per far vedere un'icona nuova bisogna cambiare il nome del file (oggi `apple-touch-icon-v2.png` in `index.html`; `apple-touch-icon.png` resta come fallback alla radice). Le icone iOS devono avere sfondo opaco (trasparente/scuro → riquadro nero in Home); vale anche per il favicon (`favicon-v2.png`, bianco), che Safari usa per i Preferiti.
- **Safe area iOS standalone**: `index.html` usa `viewport-fit=cover` + status bar `black-translucent`, quindi in modalità webapp la pagina passa sotto orologio/notch. `App.tsx` compensa con `pt-[env(safe-area-inset-top)]` sul wrapper, un velo fisso `bg-bg/90 backdrop-blur` alto quanto la safe area (per lo scroll sotto la status bar) e `pb-[calc(5rem+env(safe-area-inset-bottom))]`; la TabBar ha già `padding-bottom: env(safe-area-inset-bottom)`. Su web/desktop `env()` vale 0, nessun effetto.
- **Styling**: Tailwind CSS 4 via plugin Vite (non PostCSS). Design tokens dark-tech definiti in `src/index.css` con `@theme` (`--color-bg`, `--color-accent`, ecc.) e utility custom come `card`. Palette e direzione visiva completa in `docs/PROJECT_PLAN.md`.
- **Convenzione linguistica**: codice/identificatori in inglese, testi UI e commenti in italiano.

## Stato del progetto (aggiornato al 2026-07-20)

- **v0.5.1 live**: https://allergyscan-web.vercel.app (Vercel, piano gratuito)
- Repo GitHub privata: https://github.com/Fedanco/AllergyScanWebApp
- **Auto-deploy attivo**: ogni push su `main` fa il deploy automatico su Vercel.
- PWA installabile (vite-plugin-pwa, icone avocado, offline per l'app shell).
- Logo: avocado della vecchia app iOS (favicon, apple-touch-icon, sidebar, pagina Info).

### Fatto finora

Cronologia completa delle versioni in `CHANGELOG.md` — aggiornarlo a ogni release invece di questo file.

### Da fare / prossimi passi

1. Test dal telefono: scanner con barcode reale, dettaglio prodotto, lingua inglese e ingredienti tradotti, installazione "Aggiungi a Home".
2. Iterare su design/funzionalità in base al feedback dopo l'uso.

## Decisioni tecniche

- Dati prodotti: **Open Food Facts** (API gratuita, nessuna chiave).
- **Nessun backend**: tutto client-side, dati utente in localStorage.
- Stack: Vite + React + TypeScript. Hosting: Vercel (gratuito).
- Le decisioni di progetto complete sono in `docs/PROJECT_PLAN.md` — leggerlo prima di riprendere il lavoro.
- Ricetta di verifica E2E in `.claude/skills/verify/SKILL.md`.
