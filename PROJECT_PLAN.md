# AllergyScan Web — Piano di progetto

Versione web dell'app iOS **AllergyScan**: scansione/ricerca di prodotti alimentari tramite codice a barre, valori nutrizionali e segnalazione allergeni in base a un profilo allergie personale. Mobile-first, ma pienamente utilizzabile da desktop.

## Decisioni chiave

| Area | Decisione |
|---|---|
| Fonte dati | **Open Food Facts** (confermata, vedi confronto sotto) |
| Design | **Nuovo, dark-first / tech** — nessun riuso del vecchio look iOS |
| Backend | Nessuno per la v1: tutto lato client, persistenza in `localStorage` |
| Scanner | Incluso fin dalla v1 (fotocamera via browser, libreria `@zxing/browser`) |
| Hosting | GitHub Pages (gratuito), deploy automatico via GitHub Actions |

## Fonte dati: Open Food Facts

Endpoint prodotto: `GET https://world.openfoodfacts.org/api/v0/product/<barcode>.json` — nessuna API key, CORS abilitato, chiamabile direttamente dal browser.

### Alternative valutate e scartate

- **Chomp** — DB commerciale con allergeni, ma tier gratuito limitato e copertura scarsa per prodotti italiani/UE.
- **USDA FoodData Central** — gratuita ma richiede API key, focus USA, copertura scarsa per barcode EAN europei.
- **FatSecret** — tier gratuito generoso (5.000 req/giorno) ma richiede registrazione + OAuth: troppo complesso per un frontend statico senza backend.
- **Edamam / Nutritionix** — forti su ricette/nutrizione generica, deboli sul lookup diretto per barcode EAN di prodotti confezionati UE.

**Perché Open Food Facts vince**: nessuna API key, nessun rate limit stringente, e soprattutto la miglior copertura di barcode EAN europei/italiani — esattamente il caso d'uso di AllergyScan.

### Ottimizzazioni rispetto all'app iOS originale

1. **`?fields=`** su ogni richiesta: si scaricano solo i campi necessari (nome, marca, allergens_tags, nutriments, immagine) invece del payload completo.
2. **Cache client-side** (memoria + `localStorage` con TTL) per non ripetere richieste su barcode già cercati.
3. **Ricerca testuale** (`/cgi/search.pl`) in aggiunta al lookup per barcode esatto.
4. **Stati di errore distinti** in UI: prodotto non trovato / offline / timeout, ciascuno con il proprio fallback.

## Direzione design (dark-first / tech)

- Sfondo quasi nero (`#0A0B0D` circa), non nero puro.
- Un accento neon (verde acido/mint o ciano) usato con parsimonia: CTA, stato "sicuro", elementi attivi.
- Superfici a strati: card più chiare dello sfondo, bordi sottili invece di ombre pesanti.
- Banner allergie come badge/pill con icona (rosso acceso = allergene rilevato, verde neon = sicuro, neutro = dati mancanti).
- Micro-interazioni: transizioni leggere, animazione "linea di scansione" nello scanner.
- Navigazione: bottom tab bar su mobile → sidebar verticale su desktop.
- Design tokens definiti in Tailwind, facili da iterare.

## Stack

- **Vite + React + TypeScript** (SPA statica)
- **Tailwind CSS** (design tokens dark-tech)
- **react-router** (Search, Scan, History, Profile, Settings, Product Detail)
- **@zxing/browser** (decodifica barcode da fotocamera)
- **localStorage** (profili allergie, profilo attivo, storico scansioni)

## Funzionalità v1

1. **Search** — barcode esatto o ricerca testuale → Product Detail.
2. **Scan** — fotocamera + zxing, animazione di scansione → Product Detail.
3. **Product Detail** — card nutrimenti + banner allergie basato sul profilo attivo (matching su `allergens_tags` OFF, catalogo 14 allergeni UE).
4. **Profile** — creazione/selezione profili, checklist 14 allergeni UE.
5. **History** — storico locale, tap per riaprire il dettaglio.
6. **Settings** — info app.
7. **Responsive** mobile-first (breakpoint `md:` per desktop).

## Deploy

Repo GitHub pubblica + GitHub Actions (`.github/workflows/deploy.yml`): build Vite e pubblicazione su GitHub Pages a ogni push su `main`.
