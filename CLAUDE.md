# AllergyScan Web

Versione web dell'app iOS AllergyScan: scansiona il barcode di un prodotto alimentare e verifica se contiene allergeni pericolosi per i profili configurati.

## Contesto utente

- L'utente si chiama **Valentina**, parla **italiano** — rispondere sempre in italiano.
- Account GitHub: **Fedanco** (email git: fancona27@gmail.com).
- Tutto deve essere **gratuito** (hosting, API, servizi).
- Non è esperta di terminale: per operazioni interattive (login, comandi da lanciare a mano) dare istruzioni **passo-passo**.
- Approccio iterativo: prima una versione funzionante, poi migliorare in base al feedback.
- Design voluto: **dark-first / moderno-tech** (distacco esplicito dal vecchio look iOS).

## Stato del progetto (aggiornato al 2026-07-13)

- **v0.2.1 live**: https://allergyscan-web.vercel.app (Vercel, piano gratuito)
- Repo GitHub privata: https://github.com/Fedanco/AllergyScanWebApp
- **Auto-deploy attivo**: ogni push su `main` fa il deploy automatico su Vercel.
- PWA installabile (vite-plugin-pwa, icone avocado, offline per l'app shell).
- Logo: avocado della vecchia app iOS (favicon, apple-touch-icon, sidebar, pagina Info).

### Fatto finora

- v1: scanner barcode, ricerca, profili allergie, storico, verdetto per profilo.
- Scanner ridisegnato dopo test su iPhone (inquadratura 4:3 compatta, mira stile barcode).
- v0.2.0: dettaglio prodotto ricco (chip Nutri-Score/NOVA/Green-Score, ingredienti con allergeni evidenziati, additivi, badge vegano/olio di palma, tracce in arancione, pallini livello nutrienti), confronto multi-profilo ("Tutti i profili" con ≥2 profili). Cache prodotti con prefisso `as_product_cache_v2:`.
- v0.2.1: chip punteggio toccabili → pannello con scala visuale e spiegazione; legenda pallini nutrienti; "Mostra tutto" negli ingredienti solo se il testo supera davvero 4 righe (misura overflow + ResizeObserver); padding-bottom sul `<main>`.

### Da fare / prossimi passi

1. Test dal telefono: scanner con barcode reale, pagina dettaglio v0.2.1, installazione "Aggiungi a Home".
2. Iterare su design/funzionalità in base al feedback dopo l'uso.

## Decisioni tecniche

- Dati prodotti: **Open Food Facts** (API gratuita, nessuna chiave).
- **Nessun backend**: tutto client-side, dati utente in localStorage.
- Stack: Vite + React + TypeScript. Hosting: Vercel (gratuito).
- Le decisioni di progetto complete sono in `PROJECT_PLAN.md` — leggerlo prima di riprendere il lavoro.
- Ricetta di verifica E2E in `.claude/skills/verify/SKILL.md`.
