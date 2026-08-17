# Changelog

Cronologia delle versioni di AllergyVerify Web (ex AllergyScan Web), dalla più recente alla più vecchia.

## v0.5.3 — 2026-08-17

- Sostituito il logo (avocado della vecchia app iOS) con il nuovo logo creato da Fede — spiga di grano, lente d'ingrandimento, badge d'allerta. Icone di sistema (favicon, apple-touch-icon, icone PWA) rigenerate dal nuovo artwork; dentro l'interfaccia scura (sidebar, pagina Info, modale installa) è invece usato `BrandMark`, un'icona piatta ridisegnata a mano nello stesso linguaggio delle icone dell'app, per non avere lo sfondo bianco del logo a stonare sul tema scuro. Cache-busting favicon/apple-touch-icon aggiornato a `-v3` (iOS/Safari le cachea per URL).

## v0.5.2 — 2026-08-06

- Rebrand: nome dell'app da AllergyScan ad **AllergyVerify** — distacco dal vecchio progetto nativo iOS AllergyScan (condiviso con i colleghi, non più aggiornato). Aggiornati testi UI (IT/EN), manifest PWA, `package.json`, meta tag e documentazione. Logo/icona (ancora l'avocado) e repo/dominio pubblico rimandati a un secondo momento: il rebrand visivo richiede un redesign a parte, il rename di repo/dominio richiede conferma esplicita essendo azioni difficili da annullare (URL pubblici già condivisi).

## v0.5.1 — 2026-07-20

- Correzioni post-redesign su segnalazione utente:
  - `ScoreStrip`: badge punteggio da quadrato a cerchio (concentrico all'anello di reveal), poi anello rimosso del tutto — creava confusione sui punteggi pessimi senza un secondo prodotto a confronto.
- Passata di rifinitura + audit accessibilità (skill Impeccable) su tutte le pagine, a gruppi:
  - Dettaglio Prodotto: banner allergeni annunciato agli screen reader (`role="status" aria-live="polite"`), chip punteggio collegati al loro pannello (`aria-controls`), bottone ingredienti con `aria-expanded`.
  - Ricerca: campo di ricerca con label (prima solo placeholder), errore annunciato (`role="alert"`).
  - Scan: stato fotocamera annunciato, link vero "Vai alla ricerca manuale" quando la fotocamera non è disponibile.
  - Storico: emoji decorative marcate `aria-hidden`.
  - Profilo: campo nome con label visibile "Nome", gruppo allergeni collegato alla sua etichetta, stato di selezione profilo comunicato (`aria-pressed`).
  - Impostazioni/navigazione: `document.documentElement.lang` ora si aggiorna al cambio lingua IT/EN (prima restava fisso su "it"), barra di navigazione con etichetta, bottoni lingua raggruppati.

## v0.5.0 — 2026-07-20

- Redesign (Fase 2, skill Impeccable) — resto dell'app allineato alla Fase 1:
  - `PageHeader`: nuovo slot `action` per azioni allineate a destra (usato in Storico al posto di un wrapper ad hoc); `text-balance` sul titolo.
  - `TabBar`: evidenziazione dello stato attivo con una pillola di sfondo che dissolve tra le voci (mobile e sidebar desktop).
  - `ProductCard`: micro-interazioni coerenti con il resto dell'app (ombra al hover, freccia che scorre leggermente).
  - Ricerca e Storico: reveal in sequenza dei risultati/voci (stagger), non più un fade uniforme su tutta la lista.
  - Scan: nuovo stato "rilevato" con pausa breve, scala e glow "sicuro" (lo stesso del banner allergeni) prima di aprire il prodotto, invece di un salto istantaneo.
  - Profilo: toggle allergeni con un piccolo "pop" di scala alla selezione.
  - Impostazioni: sezione avviso medico con trattamento tonale ambra invece di una card grigia uguale alle altre; versione aggiornata a v0.5.0.

## v0.4.0 — 2026-07-20

- Redesign (Fase 1, skill Impeccable) — fondamenta + pagina Dettaglio Prodotto:
  - Font reali self-hosted (Inter, JetBrains Mono via `@fontsource`, subset latin/latin-ext), coperti dal precache PWA; prima erano dichiarati ma mai caricati e l'app cadeva su `system-ui`.
  - Sistema di ombre/glow, scala di raggi, token di movimento e `prefers-reduced-motion` globale.
  - Nuovo vocabolario di superfici (`.card` con ombra, `.card-row`, `.panel`, `.chip`) al posto dell'unica card riusata ovunque.
  - Banner allergeni ridisegnato come punto focale: icona in chip tonale, testo a piena leggibilità (contrasto verificato ≥7:1 su tutti i toni), reveal all'ingresso, glow di stato (rosso pericolo / verde sicuro) mai in loop.
  - `ProfilesVerdict`: emoji 🔴🟠🟢⚪ sostituite dalle icone SVG condivise con il resto dell'app.
  - `ScoreStrip`: anello di reveal attorno alla lettera del punteggio, pannello con gradini della scala in sequenza.

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
