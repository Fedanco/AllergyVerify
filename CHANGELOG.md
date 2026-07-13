# Changelog

Cronologia delle versioni di AllergyScan Web, dalla più recente alla più vecchia.

## v0.3.1 — 2026-07-13

- Icone Home iOS/Android rigenerate su sfondo bianco (prima erano su `#0a0b0d` → riquadro nero) con cache-busting `apple-touch-icon-v2.png`; favicon opaco bianco (`favicon-v2.png`) perché Safari lo usa anche per i Preferiti.
- Gestione safe area in modalità standalone (padding top/bottom `env()` + velo sotto la status bar) — prima titoli e contenuti si sovrapponevano a orologio e notch.

## v0.3.0 — 2026-07-13 (da PC Windows)

- Frecce dei chip punteggio allineate su mobile (`mt-auto`, erano disallineate quando il sottotitolo NOVA andava su 2 righe).
- Multilingua IT/EN completo con switcher in Settings.
- Traduzione automatica degli ingredienti nella lingua dell'app via MyMemory.
- Reset tap-highlight + `focus-ring` accessibile.
- Verificato E2E con Playwright (11/11 flussi).

## v0.2.1

- Chip punteggio toccabili → pannello con scala visuale e spiegazione.
- Legenda pallini nutrienti.
- "Mostra tutto" negli ingredienti solo se il testo supera davvero 4 righe (misura overflow + ResizeObserver).
- Padding-bottom sul `<main>`.

## v0.2.0

- Dettaglio prodotto ricco: chip Nutri-Score/NOVA/Green-Score, ingredienti con allergeni evidenziati, additivi, badge vegano/olio di palma, tracce in arancione, pallini livello nutrienti.
- Confronto multi-profilo ("Tutti i profili" con ≥2 profili).
- Cache prodotti con prefisso `as_product_cache_v2:`.

## v1

- Scanner barcode, ricerca, profili allergie, storico, verdetto per profilo.
- Scanner ridisegnato dopo test su iPhone (inquadratura 4:3 compatta, mira stile barcode).
