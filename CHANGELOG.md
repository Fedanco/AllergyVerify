# Changelog

Cronologia delle versioni di AllergyVerify (ex AllergyScan), dalla più recente alla più vecchia.

## v0.8.0 — 2026-09-15

L'app sulla stessa carta della landing.

- **Redesign completo dell'app su "carta e pennarello"**, la direzione scelta per la landing il giorno prima: fondo crema, fogli di carta con l'ombra dura, cartellini strappati per gli oggetti che contano, timbri colorati, titoli scritti a mano (Permanent Marker) e tutto il resto in JetBrains Mono. Inter e Outfit escono dal progetto. Il tema scuro "Inchiostro" (v0.6.0–v0.7.0) non c'è più: l'app è solo chiara, come il sito. Prima del codice è stata approvata una bozza delle tre schermate chiave, scegliendo tra due varianti la dock e il verdetto multi-profilo.
- **Il verdetto è un timbro.** Il cartellino del verdetto è carta strappata nella tinta del caso (rosa, gialla, verde) con il timbro a destra: CONTIENE rosso, TRACCE grano, OK verde; i cartellini neutri (nessun profilo, dati mancanti) non hanno timbro perché non sono un verdetto. Con più profili attivi, una riga per persona, ciascuna sulla propria tinta e col proprio timbro, come nel mockup della landing. Il testo resta sempre in inchiostro: rosso e verde come colore di testo non reggono il contrasto sulle tinte, e il colore lo porta il timbro.
- **Ingredienti sottolineati a pennarello**: gli allergeni del profilo hanno un tratto rosso pieno da 3px sotto la parola invece dell'evidenziatore; "senza glutine" e simili restano senza tratto, come prima.
- **Nome del prodotto scritto a mano** su un cartellino strappato, badge Nutri-Score/NOVA/Green-Score come timbri pieni con la lettera bianca, dock di navigazione come un foglietto di carta opaco (via il blur) con la tab attiva su un quadratino blu, campi con la riga di pennarello che diventa blu quando ci si scrive, bottoni blu maiuscoli come sulla landing, avviso in Info con il timbro rosso "Attenzione" su carta gialla, lingua scelta con la sottolineatura blu.
- **Privacy e Termini dentro l'app sono la stessa pagina del sito**: un foglio di carta solo, con il bottone Indietro davanti. Il componente vive in `src/paper/LegalPage` ed è usato da entrambi.
- **Design system condiviso in `src/paper/`**: token, base e utility della carta (`torn`, `stamp`, `sheet`, `grain`, `focus-ring`, `lift`) più i componenti `Torn`, `Stamp`, `Sheet` e il generatore dello strappo sono stati spostati fuori dalla landing e importati da entrambi i fogli Tailwind, così non esistono due copie. La landing è rimasta identica (stesse classi nel bundle, verificato).
- Regole nate con questo giro: i cartellini strappati sono un filtro, quindi al massimo tre per schermata e mai in una lista; le animazioni stanno sempre su un wrapper, mai sull'elemento filtrato; il grano non è mai un colore di testo (l'ambra da testo è un token a parte); Permanent Marker mai sugli allergeni, sul verdetto o sul testo corrente.
- Colori di sistema aggiornati (`theme-color` e manifest sul crema); su iPhone la status bar in modalità webapp passa da `black-translucent` a `default`, perché sulla carta chiara l'orologio bianco spariva. Le misure della safe area non cambiano.

## v0.7.0 — 2026-09-15

La landing page, e l'app che si sposta su `/app/`.

- **Landing pubblica alla radice del dominio** (https://allergyverify.vercel.app/), in italiano e inglese con lo stesso interruttore di lingua dell'app (chiave `as_lang`: la scelta fatta sulla landing vale anche aprendo l'app). Direzione visiva "carta e pennarello", scelta tra quattro proposte: fondo carta, cartellini strappati, timbri colorati, titolo scritto a mano (Permanent Marker) con sottolineatura a pennarello, testo in JetBrains Mono, tratti a pastello disegnati in SVG. Blu per l'interazione, rosso per "contiene", verde per "sicuro", il grano del logo per le tracce. Nessuno screenshot dell'app: la schermata del verdetto è ridisegnata su carta (una tessera per persona, ingredienti sottolineati), e le funzioni sono raccontate come un'etichetta alimentare (Ingredienti / Senza / Valori medi per 100 g di spesa). Il logo entra nell'hero tale e quale, come un adesivo incollato storto.
- **L'app vive su `/app/`** (`app/index.html`, seconda entry del build Vite, base assoluta `/`). Le route hash restano uguali (`/app/#/scan`). Il manifest PWA ha `start_url`, `scope` e `id` su `/app/`: installando dalla landing si apre direttamente l'app. Il `localStorage` non cambia origine, quindi profili e storico restano.
- **Chi aveva già la webapp in Home** (start_url vecchia `/`) o un vecchio link con `#/…` viene rediretto a `/app/` da uno script inline nella landing, prima di caricare qualsiasi altra cosa: iOS non aggiorna la start_url delle webapp già installate.
- Service worker: il fallback di navigazione punta a `app/index.html` ma **solo sotto `/app`** (senza l'allowlist, `/?x=1` finiva sull'app perché una query non prevista non trovava la landing nel precache); qualunque query string trova comunque la pagina nel precache.
- Le animazioni dei tratti a pastello agiscono sul `clip-path` dell'`<svg>`, mai sui path filtrati: animare un path con `feTurbulence` ricalcolava il filtro a ogni frame e bloccava il rendering.
- **Privacy e Termini anche sulla landing** (`/privacy/`, `/terms/`), nella stessa veste di carta: dal sito non si finisce più dentro l'app per leggerli. I testi sono stati spostati in `src/i18n/legal.ts`, condiviso con le pagine dell'app, così restano una copia sola.
- Dopo il primo giro di feedback: "Come funziona" ha un titolo e un'introduzione come le altre sezioni (prima la fascia partiva subito sotto l'hero e non si leggeva come sezione), le righe blu riprese dal mock sono state tolte (terzo contenitore intorno a timbro e cartellino, e unica cornice di tutta la pagina) e l'installazione è diventata il quarto cartellino, su carta gialla. Il bottone secondario dell'hero, che portava alla sezione subito sotto, ora è "Guarda un esempio" e salta al verdetto ridisegnato. Per separare meglio le sezioni, scelta tra quattro prove confrontate in un artefatto (fogli alternati, tratto di pastello, entrambi, sezione blu): **fogli alternati**. "Come funziona" e "Cosa c'è dentro" stanno su un cartoncino più scuro a tutta larghezza con lo strappo sopra e sotto (`Sheet`), così la pagina si legge come una pila di fogli anche scorrendo in fretta.
- Meta Open Graph e immagine di anteprima (`og-v1.png`, fotografata dalla modalità `/?og`), `robots.txt` che esclude `/app/` dall'indicizzazione, versione mostrata in Info aggiornata.

## v0.6.3 — 2026-08-19

Due difetti visivi segnalati durante l'uso.

- **Gli angoli della pagina Info non si squadrano più al passaggio del mouse.** Le righe delle card (Lingua, Installa, Che cos'è, Privacy…) si illuminano al passaggio del cursore, ma quello sfondo è un rettangolo pieno: sulla prima e sull'ultima riga copriva gli angoli arrotondati della card, che per un attimo sembrava un rettangolo a 90°. Ora la riga di testa e quella di coda prendono il raggio della card. Non si è usato `overflow: hidden`, che avrebbe tagliato anche l'anello di focus della tastiera (sta 3px fuori dal bordo). Quando una riga è aperta il bottone resta squadrato in basso, perché lì si trova in mezzo alla pila.
- **La barra di ricerca adesso si vede.** Usava la superficie "a incavo", il cui sfondo è esattamente il fondo pagina: appoggiata direttamente sulla pagina non aveva niente in cui affondare, e ne restava visibile solo il filo di luce inferiore — sembrava una riga sottolineata, non un campo. Ora sale di un livello di tono (nuova utility `field`) e tiene l'ombra interna in alto, così resta una conca in cui scrivere ma con una forma chiusa. Dentro una card il campo continua a usare l'incavo, dove funziona.
- Il testo segnaposto dei campi (ricerca e nome profilo) era a opacità ridotta, contro la regola del progetto sul contrasto: ora usa il token pieno `ink-dim`.
- La versione mostrata in Info era rimasta a v0.6.1 mentre il progetto era già alla 0.6.2.

## v0.6.2 — 2026-08-19

Il verdetto con più profili attivi diventa una scheda per persona.

- **Via la scatola rossa unica.** Con due o tre profili il blocco era un solo riquadro velato di rosso con l'elenco delle persone dentro: il colore copriva tutto, quindi non distingueva più niente — anche i dischi con l'iniziale erano rossi su rosso, e chi poteva mangiare il prodotto si scopriva solo leggendo. Ora c'è **una tessera per persona**, ciascuna col proprio tono: rossa se contiene un suo allergene, arancio se ci sono tracce, verde se è a posto. Con due o tre persone la domanda vera non è "c'è un allergene?" ma "per chi?", e la risposta adesso si vede prima di leggere i nomi.
- **Riga di sintesi sopra le tessere** ("Allergeni per 1 profilo su 3") con il pallino del caso peggiore, per chi guarda la pagina da lontano. Le frasi lunghe del vecchio titolo sono state sostituite da tre stringhe corte (`multiSummaryDanger/Traces/Safe`, IT+EN); le cinque stringhe che non servivano più sono state rimosse.
- **Ogni tessera dice cosa e perché**: "Contiene 🥛 Latte", "Può contenere 🌾 Glutine", "Nessun allergene" — la parola *Contiene* contro *Può contenere* è quella che cambia la decisione, e prima stava solo nel titolo del riquadro.
- La griglia usa `auto-fit`: due tessere per riga su telefono, tutte in fila su schermo largo, senza breakpoint. Sei varianti sono state disegnate e confrontate a video prima di scegliere questa.
- Il banner a **profilo singolo non cambia** (stesso riquadro tonale con i chip degli allergeni); la prop `rows` di `Pill`, che serviva solo al vecchio elenco, è stata rimossa.

## v0.6.1 — 2026-08-18

Il logo dell'app torna a essere il file che ho disegnato, ovunque.

- **Nomi accorciati ovunque**: il dominio passa da `allergyverify-web.vercel.app` a **https://allergyverify.vercel.app**, e il repo GitHub da `AllergyVerifyWebApp` ad `AllergyVerify`. Il suffisso `-web` distingueva la webapp dalla vecchia app iOS AllergyScan, che non è più un progetto attivo. Il vecchio indirizzo è stato rimosso, non lasciato in redirect: chi aveva la webapp installata dal vecchio indirizzo deve riaggiungerla, e i profili salvati là restano su quell'origine — il `localStorage` non attraversa i domini.

- **Inquadratura ripristinata.** Le icone in uso erano state derivate schiacciando lo squircle originale in un quadrato: il disegno finiva più in basso e più grande, con appena lo 0,6% di margine sotto — foglie verdi e badge rosso a filo del bordo, contro il 10% ai lati. Ora tutte le icone nascono da `assets/logo-source.png`, il file originale, con scala sempre uniforme: le proporzioni non si toccano.
- **Via la cornice intorno al logo.** `LogoTile` incastonava l'immagine in una `card`: nella dock desktop quel riquadro da 40px, con un raggio di 24px, diventava un cerchio pieno — uno squircle dentro un cerchio, con dentro ancora un rettangolo arrotondato. Tre forme annidate che non combaciavano. Il file è già un'icona finita, con la sua forma, la sua luce e la sua ombra: adesso si mostra da sola, come un'icona sulla Home di iOS poggiata sul fondo scuro.
- **Nessun ritaglio.** Il tile entra intero nel quadrato dell'icona, con gli angoli riempiti di bianco: sono bianchi quanto il tile, quindi non si vedono, e sopra ci va comunque la maschera del sistema. Un tentativo intermedio ingrandiva il tile fino a portarlo agli angoli — e ricambiava l'inquadratura dell'8% per lato, cioè il difetto da cui si partiva. Unica eccezione l'icona `maskable` di Android, dove la maschera è un cerchio e il soggetto deve stare nel 62% centrale: lì lo squircle non c'è.
- **Un unico script rifà tutto**: `scripts/build-icons.ps1` (PowerShell + System.Drawing, nessuna dipendenza da installare) genera i sette file da quell'unica sorgente e misura da sé forma, riquadri e zoom necessario, così un riesporto del logo non richiede di rifare i conti a mano.
- Nomi file versionati (`favicon-v5`, `apple-touch-icon-v5`, `pwa-*-v2`) perché **iOS cachea le icone per URL**: riscrivere lo stesso nome non cambierebbe nulla sui telefoni che l'hanno già installata. I file superati sono stati rimossi.

## v0.6.0 — 2026-08-18

Redesign completo dell'interfaccia ("Inchiostro") — la pelle era ancora quella del progetto precedente, nome e logo no.

- **Palette rifatta.** Fondo blu notte profondo (`#070b12`) al posto del nero-blu da dashboard, superfici a tre livelli, ombre tinte del fondo invece che nere. Provate sei varianti dal vivo sul telefono (da inchiostro a cacao) con un selettore temporaneo, poi rimosso.
- **Colore di marca separato dai toni semantici.** Prima `--color-accent` (verde) era insieme il colore delle azioni e il verde di "sicuro per te". Ora il grano del logo (`--color-accent`) copre solo interazione e stato, mentre `--color-safe` significa una cosa sola: nessun allergene per te. Senza questa separazione, col grano come colore di marca un verdetto positivo sarebbe diventato giallo.
- **Superfici materiche.** Le card si staccano dal fondo per salto di tono più un filo di luce sul bordo alto, senza bordo grigio; nuova `inset-surface` per gli elementi che affondano (campi di testo, immagini nelle liste, chip selezionati). Raggi da 16 a 24px. Riferimento visivo: family.co.
- **Outfit per i titoli** (`--font-display`, +47 KB in due subset): nome pagina, nome prodotto e riga del verdetto. Il testo di lettura e i dati restano su Inter. Scala tipografica di un gradino più contenuta sotto i 640px.
- **Verdetto allergeni ridisegnato**: disco icona a colore pieno, titolo più grande, allergeni elencati come chip invece che in una riga di virgole, superficie tonale dal 10% al 20% (sul nuovo fondo il 10% era un grigio appena colorato).
- **Pagina prodotto riordinata**: nome → verdetto → confronto profili → ingredienti (la prova del verdetto) → punteggi → nutrienti. Prima Nutri-Score e NOVA stavano sopra al verdetto.
- **Navigazione staccata dai bordi**: dock flottante con angoli da 28px e sfocatura (l'unico punto dove il contenuto passa davvero sotto), tab attivo con disco pieno dorato. Su desktop la sidebar diventa una colonna staccata. Aggiornati coerentemente i tre punti che governano la safe area iOS.
- **Più profili attivi insieme.** In famiglia ogni persona ha allergie diverse e la spesa è una sola: si spuntano i profili che servono (caselle quadrate, nessuna modalità da attivare) e il verdetto dice **per chi** c'è il problema, non solo che c'è. Ricerca, storico ed evidenziazione ingredienti seguono l'unione dei profili selezionati. L'ultimo profilo attivo non è disattivabile.
- **Icone al posto delle emoji**: nuove `PackageIcon`, `NotFoundIcon`, `CameraOffIcon`, `PlusIcon`, `CheckMarkIcon`. Le nove emoji della tabella nutrienti sono state rimosse, non sostituite: rubavano l'occhio al pallino di livello, che è l'unico segnale informativo della riga. Restano le emoji degli allergeni e dei badge dieta, che sono etichette di cibo e non icone di sistema.
- **Segnaposto di caricamento** (`skeleton`) al posto della scritta "Caricamento prodotto…" al centro del vuoto.
- **Inglese come lingua iniziale** (era italiano), con `lang` allineato in `index.html` e nel manifest, e descrizione dell'app tradotta. L'italiano resta selezionabile da Info → Lingua.
- Audit contrasti su tutte le schermate con misurazione dei colori compositi via canvas: eliminate le opacità sul testo (`text-ink-dim/50-70`), che scendevano fino a 3,2:1. Nessun testo sotto AA.

### Correzioni

- **Il salvataggio profilo non funzionava** aprendo l'app da un indirizzo di rete in http: `crypto.randomUUID()` esiste solo in contesto sicuro (https o localhost) e l'errore usciva solo nel log del server. Ora c'è un fallback. Il difetto non si vedeva online, dove Vercel serve in https.
- **Allergeni dichiarati assenti segnalati come presenti**: la ricerca testuale trovava "glutine" dentro "Senza glutine" e dava "Contiene: Glutine" su prodotti gluten-free. Ora le negazioni vengono riconosciute in italiano, inglese, francese e tedesco ("senza X", "X free"), con criterio volutamente prudente — un falso negativo è molto più grave di un falso positivo, quindi un match si scarta solo quando la negazione è inequivocabile. Stessa regola nell'evidenziazione degli ingredienti, così verdetto e testo non si contraddicono.
- **Fotocamera**: distinti tre casi prima confusi in uno — permesso negato (con "Riprova" e istruzioni per riattivarlo), connessione non sicura (`navigator.mediaDevices` non esiste in http), dispositivo senza fotocamera. Prima l'app diceva che il telefono non aveva una fotocamera utilizzabile, il che era falso e non suggeriva nulla da fare. Aggiunto `npm run dev:https` per provare lo scanner dal telefono in rete locale.
- **Nome del profilo non più obbligatorio**: il salva restava disabilitato senza spiegare perché, e con l'accento dorato il bottone spento sembrava attivo. Se il nome manca ne viene messo uno predefinito.
- Il logo non si nascondeva nella dock su mobile e si sovrapponeva all'icona Storico: `inline-flex` nel componente vinceva su `hidden` passato dall'esterno.

## v0.5.3 — 2026-08-17

- Sostituito il logo (avocado della vecchia app iOS) con il nuovo logo che ho disegnato — spiga di grano, lente d'ingrandimento, badge d'allerta. Icone di sistema (favicon, apple-touch-icon, icone PWA) rigenerate dal nuovo artwork; cache-busting favicon/apple-touch-icon aggiornato a `-v3` (iOS/Safari le cachea per URL). Dentro l'interfaccia scura (sidebar, pagina Info, modale installa) usato `LogoTile`, un piccolo riquadro con bordo/ombra che incornicia l'immagine vera (un primo tentativo di ridisegnarla come icona piatta era irriconoscibile ed è stato scartato).
- Rebrand completato anche su repo GitHub (`AllergyVerifyWebApp`) e dominio Vercel (`allergyverify-web.vercel.app`), con redirect attivi dai vecchi indirizzi.

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
