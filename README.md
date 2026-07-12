# AllergyScan Web 🍎🚫

Versione web di **AllergyScan**: scansiona o cerca un prodotto alimentare e scopri subito se contiene i tuoi allergeni, in base al tuo profilo personale.

Mobile-first, utilizzabile anche da desktop. Design dark / tech.

## Funzionalità

- 🔍 **Ricerca** per codice a barre o per nome prodotto
- 📷 **Scansione** del codice a barre con la fotocamera (direttamente dal browser)
- ⚠️ **Verdetto allergie**: banner rosso/verde in base al profilo attivo (14 allergeni UE)
- 📊 **Valori nutrizionali** per 100 g
- 🕘 **Storico** di scansioni e ricerche
- 👤 **Profili allergie** multipli, salvati solo sul dispositivo

## Dati e privacy

- Dati prodotto da [Open Food Facts](https://world.openfoodfacts.org) (database libero e collaborativo), richiesti con `?fields=` ridotti e cache locale 24h.
- Nessun backend, nessun account: profili e storico vivono in `localStorage`.

> ⚠️ Le informazioni possono essere incomplete: in caso di allergie gravi verifica sempre l'etichetta del prodotto.

## Sviluppo

```bash
npm install
npm run dev       # server di sviluppo su http://localhost:5173
npm run build     # build di produzione in dist/
npm run preview   # anteprima della build
```

Stack: Vite · React · TypeScript · Tailwind CSS 4 · react-router · @zxing/browser

## Deploy

Push su `main` → GitHub Actions builda e pubblica automaticamente su GitHub Pages (`.github/workflows/deploy.yml`).

Le decisioni di progetto sono documentate in [PROJECT_PLAN.md](PROJECT_PLAN.md).
