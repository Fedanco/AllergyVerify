/**
 * Dizionario centralizzato IT/EN.
 * `it` è la sorgente: il tipo `Translations` deriva da lì, così TypeScript
 * segnala in build qualsiasi chiave mancante o in più nella versione `en`.
 * Le voci con valori interpolati sono funzioni, non stringhe.
 */

export type Lang = 'it' | 'en'

const it = {
  app: {
    loadingScanner: 'Caricamento scanner…',
    mainNavAria: 'Navigazione principale',
  },
  tabs: {
    search: 'Cerca',
    scan: 'Scan',
    history: 'Storico',
    profile: 'Profilo',
    settings: 'Altro',
  },
  common: {
    unnamedProduct: 'Prodotto senza nome',
  },
  search: {
    title: 'Cerca un prodotto',
    subtitle: 'Inserisci un codice a barre o il nome di un prodotto',
    placeholder: 'es. 8076809513753 o «biscotti»',
    submit: 'Cerca',
    emptyHint1: 'Cerca per codice a barre per un risultato esatto,',
    emptyHint2: 'oppure per nome per esplorare i prodotti.',
    errors: {
      'not-found': 'Nessun prodotto trovato. Controlla il codice o prova con il nome.',
      offline: 'Sei offline: connettiti a internet e riprova.',
      timeout: 'La richiesta ha impiegato troppo tempo. Riprova.',
      error: 'Si è verificato un errore. Riprova tra poco.',
    },
  },
  scan: {
    title: 'Scansiona',
    subtitle: 'Inquadra il codice a barre del prodotto',
    starting: 'Avvio fotocamera…',
    deniedTitle: 'Fotocamera non autorizzata',
    denied:
      "Senza fotocamera non possiamo leggere il codice a barre. Se hai negato l'accesso per sbaglio, puoi riattivarlo.",
    unavailableTitle: 'Fotocamera non disponibile',
    unavailable:
      'Questo dispositivo non espone una fotocamera utilizzabile dal browser.',
    insecureTitle: 'Connessione non sicura',
    insecure:
      'I browser permettono di usare la fotocamera solo su connessioni sicure (https). Stai aprendo l\'app da un indirizzo di rete locale in http, quindi la fotocamera non è nemmeno richiedibile. Sul sito pubblicato funziona.',
    retry: 'Riprova',
    howToTitle: 'Come riattivarla',
    howToIos:
      'iPhone: tocca «aA» nella barra dell\'indirizzo → Impostazioni sito web → Fotocamera → Consenti.',
    howToAndroid:
      'Android: tocca il lucchetto accanto all\'indirizzo → Autorizzazioni → Fotocamera.',
    hint: 'Il codice viene riconosciuto automaticamente: nessuno scatto necessario.',
    searchInstead: 'Cerca il prodotto a mano',
  },
  history: {
    title: 'Storico',
    subtitle: (n: number) =>
      `${n} prodott${n === 1 ? 'o' : 'i'} tra scansioni e ricerche`,
    clear: 'Svuota',
    confirmClear: 'Svuotare tutto lo storico?',
    empty: 'Lo storico è vuoto: i prodotti che scansioni o cerchi appariranno qui.',
    sourceScan: 'Scansione',
    sourceSearch: 'Ricerca',
    dateLocale: 'it-IT',
  },
  profile: {
    title: 'Profili allergie',
    subtitle: 'Il profilo attivo viene usato per il verdetto sui prodotti',
    subtitleMulti: 'I profili selezionati vengono usati insieme per il verdetto',
    noAllergens: 'Nessun allergene selezionato',
    edit: 'Modifica',
    confirmDelete: (name: string) => `Eliminare il profilo "${name}"?`,
    deleteAria: (name: string) => `Elimina profilo ${name}`,
    newProfile: 'Nuovo profilo',
    editorTitleEdit: (name: string) => `Modifica "${name}"`,
    editorTitleNew: 'Nuovo profilo',
    nameLabel: 'Nome',
    namePlaceholder: 'Nome (es. Marco)',
    allergensLabel: 'I tuoi allergeni (14 allergeni UE):',
    save: 'Salva profilo',
    /** usato quando si salva senza aver scritto un nome */
    defaultName: 'Il mio profilo',
    cancel: 'Annulla',
  },
  settings: {
    title: 'Info',
    subtitle: 'AllergyVerify',
    languageTitle: 'Lingua',
    aboutTitle: "Che cos'è",
    aboutBody:
      'Versione web di AllergyVerify: scansiona o cerca un prodotto alimentare e scopri subito se contiene i tuoi allergeni, in base al profilo attivo.',
    dataTitle: 'Dati',
    dataBody1: 'I dati dei prodotti provengono da ',
    dataBody2:
      ', resi disponibili con licenza Open Database License (ODbL): possono contenere errori e non vanno usati per scopi medici. Gli ingredienti vengono tradotti con MyMemory quando serve. Profili e storico restano solo su questo dispositivo (localStorage): nessun account, nessun server.',
    privacyRowTitle: 'Privacy',
    termsRowTitle: 'Termini e responsabilità',
    githubLabel: 'Codice sorgente su GitHub',
    installTitle: "Installa l'app",
    installBody: "Aggiungi AllergyVerify alla schermata Home per usarla come un'app vera, anche offline.",
    installCta: 'Installa',
    installCtaGuide: 'Come si fa',
    installBody1:
      'AllergyVerify si può aggiungere alla schermata Home come una vera app: su iPhone tocca ',
    installIos: 'Condividi → Aggiungi alla schermata Home',
    installBody2:
      '; su Android usa il banner di installazione o il menu del browser (',
    installAndroid: 'Installa app',
    installBody3: ').',
    warningTitle: 'Attenzione',
    warningBody:
      "Le informazioni potrebbero essere incomplete, errate o non aggiornate, e non sostituiscono il parere medico né l'etichetta del prodotto: in caso di allergie gravi, verifica sempre l'etichetta. Per il testo completo vedi Termini e responsabilità qui sopra.",
  },
  installBanner: {
    title: 'Installa AllergyVerify',
    body: 'Aggiungila alla schermata Home: si apre a schermo intero, funziona anche offline.',
    cta: 'Installa',
    ctaGuide: 'Come si fa',
    continueCta: 'Continua',
    dismissAria: 'Chiudi il banner di installazione',
  },
  installGuide: {
    title: 'Aggiungi alla schermata Home',
    step1: 'Tocca Condividi',
    step2: 'Tocca "Aggiungi alla schermata Home"',
    gotIt: 'Ho capito',
  },
  productDetail: {
    back: 'Indietro',
    loading: 'Caricamento prodotto…',
    nutrimentsTitle: 'Valori nutrizionali',
    per100g: '/ 100 g',
    nutrimentsUnavailable:
      'Valori nutrizionali non disponibili per questo prodotto.',
    levelTitle: (label: string) => `Livello ${label}`,
    levelLegend:
      'Il pallino indica se la quantità per 100 g è bassa, moderata o alta rispetto alle soglie nutrizionali di riferimento europee.',
    levels: { low: 'basso', moderate: 'moderato', high: 'alto' },
    nutriments: {
      energy: 'Energia',
      carbohydrates: 'Carboidrati',
      sugars: 'Zuccheri',
      fat: 'Grassi',
      saturatedFat: 'Grassi saturi',
      proteins: 'Proteine',
      fiber: 'Fibre',
      salt: 'Sale',
      sodium: 'Sodio',
    },
    errors: {
      'not-found': 'Prodotto non presente nel database Open Food Facts.',
      offline: 'Sei offline: connettiti a internet e riprova.',
      timeout: 'La richiesta ha impiegato troppo tempo. Riprova.',
      error: 'Si è verificato un errore nel caricamento del prodotto.',
    },
    disclaimer1: "Informazione indicativa, non sostituisce l'etichetta. ",
    disclaimerLink: 'Termini',
  },
  scores: {
    nutriHint: 'Qualità nutrizionale',
    novaHint: 'Grado di trasformazione',
    greenHint: 'Impatto ambientale',
    nutriAbout:
      'Riassume la qualità nutrizionale per 100 g: penalizza calorie, zuccheri, grassi saturi e sale, premia fibre e proteine. A = migliore, E = peggiore.',
    novaAbout:
      "Indica quanto un alimento è lavorato industrialmente, non quanto è sano. 1 = non trasformato, 4 = ultra-trasformato.",
    greenAbout:
      "Stima l'impatto ambientale del prodotto sull'intero ciclo di vita: produzione, trasporto e imballaggio. A = impatto minimo, F = massimo.",
    nutriMeanings: {
      a: 'Qualità nutrizionale ottima.',
      b: 'Qualità nutrizionale buona.',
      c: 'Qualità nutrizionale nella media.',
      d: 'Qualità nutrizionale scarsa.',
      e: 'Qualità nutrizionale molto scarsa.',
    },
    novaMeanings: {
      1: 'Alimento non trasformato o minimamente trasformato (es. frutta, latte, legumi).',
      2: 'Ingrediente culinario trasformato (es. olio, burro, zucchero, sale).',
      3: 'Alimento trasformato (es. pane, formaggi, verdure in scatola).',
      4: 'Alimento ultra-trasformato: contiene ingredienti o processi industriali (emulsionanti, aromi, coloranti…).',
    },
    greenMeanings: {
      a: 'Impatto ambientale molto basso.',
      b: 'Impatto ambientale basso.',
      c: 'Impatto ambientale moderato.',
      d: 'Impatto ambientale alto.',
      e: 'Impatto ambientale molto alto.',
      f: 'Impatto ambientale altissimo.',
    },
    dataBy: 'Dati calcolati da Open Food Facts.',
  },
  allergyBanner: {
    noProfileTitle: 'Nessun profilo attivo',
    noProfileBody: 'Crea un profilo allergie per il verdetto personalizzato.',
    noDataTitle: 'Dati insufficienti',
    noDataBody:
      "Il prodotto non riporta ingredienti né allergeni: non possiamo stabilirlo, controlla l'etichetta.",
    dangerTitle: (name: string) => `Attenzione, ${name}!`,
    contains: (list: string) => `Contiene: ${list}`,
    containsLabel: 'Contiene',
    safeWithTracesTitle: 'Nessun tuo allergene tra gli ingredienti',
    safeWithTracesBody: 'Occhio però alle possibili tracce qui sotto.',
    tracesTitle: 'Possibili tracce',
    mayContain: (list: string) => `Può contenere: ${list}`,
    mayContainLabel: 'Può contenere',
    safeTitle: 'Nessun tuo allergene rilevato',
    safeBody: (name: string) =>
      `Sicuro per il profilo "${name}" secondo i dati disponibili.`,
    /* Riga di sintesi sopra le tessere del verdetto multi-profilo: sta su
       una riga sola in maiuscoletto, quindi è più corta delle frasi di
       verdetto a profilo singolo. Il dettaglio sta nelle tessere. */
    multiSummaryDanger: (n: number, tot: number) =>
      `Allergeni per ${n} profil${n === 1 ? 'o' : 'i'} su ${tot}`,
    multiSummaryTraces: (n: number, tot: number) =>
      `Possibili tracce per ${n} profil${n === 1 ? 'o' : 'i'} su ${tot}`,
    multiSummarySafe: (tot: number) => `Nessun allergene per i ${tot} profili attivi`,
    multiRowSafe: 'Nessun allergene',
  },
  ingredients: {
    title: 'Ingredienti',
    showAll: 'Mostra tutto',
    showLess: 'Mostra meno',
    unavailable: 'Elenco ingredienti non disponibile per questo prodotto.',
    translating: 'Traduzione…',
    badges: {
      vegan: 'Vegano',
      'non-vegan': 'Non vegano',
      vegetarian: 'Vegetariano',
      'non-vegetarian': 'Non vegetariano',
      'palm-oil-free': 'Senza olio di palma',
      'palm-oil': 'Con olio di palma',
    },
    additivesTitle: 'Additivi',
    noAdditives: 'Nessun additivo segnalato.',
  },
  privacy: {
    title: 'Privacy',
    updated: 'Ultimo aggiornamento: 18 agosto 2026',
    intro:
      "AllergyVerify è pensata per non raccogliere dati: non c'è un account, non c'è un server che conserva le tue informazioni. Questa pagina spiega nel dettaglio cosa succede ai tuoi dati mentre usi l'app.",
    controllerTitle: 'Titolare del trattamento',
    controllerBody:
      'Il progetto è gestito da AllergyVerify. Per qualsiasi domanda su questa informativa o sui tuoi dati puoi scrivere a ',
    contactEmail: 'AllergyVerify@protonmail.com',
    dataTitle: 'I tuoi dati restano sul tuo dispositivo',
    dataBody:
      "I profili allergie e lo storico delle scansioni sono salvati solo nella memoria locale del tuo browser (localStorage). Non vengono mai inviati a un server: se disinstalli l'app o svuoti i dati del sito, spariscono e nessuno ne ha una copia, noi compresi.",
    thirdPartiesTitle: 'Servizi di terze parti usati dall\'app',
    thirdPartiesIntro:
      "Per funzionare, AllergyVerify comunica con questi servizi esterni, che possono ricevere il tuo indirizzo IP secondo le rispettive policy:",
    thirdParties: [
      {
        name: 'Open Food Facts',
        body: 'fornisce i dati dei prodotti quando cerchi o scansioni un barcode.',
      },
      {
        name: 'MyMemory',
        body: 'traduce automaticamente il testo degli ingredienti quando serve.',
      },
      {
        name: 'Vercel',
        body: "ospita il sito: come qualunque hosting, registra dati tecnici di accesso (es. indirizzo IP) nei log del server.",
      },
    ],
    cookiesTitle: 'Nessun cookie di tracciamento',
    cookiesBody:
      "AllergyVerify non usa cookie di profilazione né strumenti di analytics o pubblicità. Il localStorage descritto sopra serve solo al funzionamento dell'app (salvare profili e storico) e non richiede consenso.",
    rightsTitle: 'I tuoi diritti',
    rightsBody:
      "Puoi cancellare tutti i tuoi dati in autonomia in qualsiasi momento, svuotando i dati del sito dalle impostazioni del browser: non serve chiedere nulla, perché non ne conserviamo copia. Per qualsiasi domanda, scrivici all'indirizzo sopra.",
  },
  terms: {
    title: 'Termini e responsabilità',
    updated: 'Ultimo aggiornamento: 18 agosto 2026',
    intro:
      'Usando AllergyVerify accetti questi termini. Leggili con attenzione: riguardano le tue allergie.',
    purposeTitle: "A cosa serve l'app",
    purposeBody:
      "AllergyVerify ti aiuta a controllare più in fretta se un prodotto contiene i tuoi allergeni, confrontando i dati disponibili con il tuo profilo. È uno strumento di supporto, non un sostituto: il dato definitivo resta sempre l'etichetta fisica del prodotto che hai in mano.",
    accuracyTitle: 'Nessuna garanzia sui dati',
    accuracyBody:
      "I dati dei prodotti provengono da Open Food Facts, un database collaborativo aperto: possono essere mancanti, non aggiornati o inseriti in modo scorretto da chi contribuisce. Anche la traduzione automatica degli ingredienti può contenere imprecisioni. AllergyVerify non verifica né garantisce l'accuratezza di queste informazioni.",
    medicalTitle: 'Non è un consiglio medico',
    medicalBody:
      "AllergyVerify non è un dispositivo medico e non fornisce consulenza medica. In caso di dubbi, allergie gravi o reazioni, rivolgiti sempre a un medico e non affidarti solo all'app.",
    liabilityTitle: 'Limitazione di responsabilità',
    liabilityBody:
      "Usi l'app a tuo rischio. Nei limiti consentiti dalla legge, chi sviluppa AllergyVerify non è responsabile di eventuali conseguenze — comprese reazioni allergiche — derivanti da dati mancanti, errati o non aggiornati nelle fonti terze utilizzate dall'app.",
    licenseTitle: 'Licenza dei dati',
    licenseBody:
      'I dati dei prodotti provengono da Open Food Facts (openfoodfacts.org), resi disponibili con licenza Open Database License (ODbL) v1.0. Le informazioni sono fornite a scopo indicativo, possono contenere errori e non vanno usate per scopi medici.',
    changesTitle: 'Modifiche a questi termini',
    changesBody:
      "Questi termini possono cambiare in futuro, ad esempio se l'app aggiunge nuove funzionalità. La data qui sopra indica l'ultimo aggiornamento.",
  },
}

export type Translations = typeof it

const en: Translations = {
  app: {
    loadingScanner: 'Loading scanner…',
    mainNavAria: 'Main navigation',
  },
  tabs: {
    search: 'Search',
    scan: 'Scan',
    history: 'History',
    profile: 'Profile',
    settings: 'More',
  },
  common: {
    unnamedProduct: 'Unnamed product',
  },
  search: {
    title: 'Search a product',
    subtitle: 'Enter a barcode or a product name',
    placeholder: 'e.g. 8076809513753 or "cookies"',
    submit: 'Search',
    emptyHint1: 'Search by barcode for an exact result,',
    emptyHint2: 'or by name to explore products.',
    errors: {
      'not-found': 'No product found. Check the code or try the name.',
      offline: 'You are offline: connect to the internet and try again.',
      timeout: 'The request took too long. Try again.',
      error: 'Something went wrong. Try again shortly.',
    },
  },
  scan: {
    title: 'Scan',
    subtitle: 'Frame the product barcode',
    starting: 'Starting camera…',
    deniedTitle: 'Camera not allowed',
    denied:
      'Without the camera we cannot read the barcode. If you denied access by mistake, you can turn it back on.',
    unavailableTitle: 'Camera not available',
    unavailable: 'This device has no camera the browser can use.',
    insecureTitle: 'Insecure connection',
    insecure:
      'Browsers only allow camera access over a secure connection (https). You are opening the app from a local network address over http, so the camera cannot even be requested. It works on the published site.',
    retry: 'Try again',
    howToTitle: 'How to turn it back on',
    howToIos:
      'iPhone: tap "aA" in the address bar → Website Settings → Camera → Allow.',
    howToAndroid:
      'Android: tap the padlock next to the address → Permissions → Camera.',
    hint: 'The barcode is recognized automatically: no need to take a picture.',
    searchInstead: 'Search for the product manually',
  },
  history: {
    title: 'History',
    subtitle: (n: number) =>
      `${n} product${n === 1 ? '' : 's'} from scans and searches`,
    clear: 'Clear',
    confirmClear: 'Clear all history?',
    empty: 'History is empty: products you scan or search will appear here.',
    sourceScan: 'Scan',
    sourceSearch: 'Search',
    dateLocale: 'en-US',
  },
  profile: {
    title: 'Allergy profiles',
    subtitle: 'The active profile is used for product verdicts',
    subtitleMulti: 'The selected profiles are used together for the verdict',
    noAllergens: 'No allergens selected',
    edit: 'Edit',
    confirmDelete: (name: string) => `Delete profile "${name}"?`,
    deleteAria: (name: string) => `Delete profile ${name}`,
    newProfile: 'New profile',
    editorTitleEdit: (name: string) => `Edit "${name}"`,
    editorTitleNew: 'New profile',
    nameLabel: 'Name',
    namePlaceholder: 'Name (e.g. Alex)',
    allergensLabel: 'Your allergens (14 EU allergens):',
    save: 'Save profile',
    defaultName: 'My profile',
    cancel: 'Cancel',
  },
  settings: {
    title: 'Info',
    subtitle: 'AllergyVerify',
    languageTitle: 'Language',
    aboutTitle: 'What it is',
    aboutBody:
      'Web version of AllergyVerify: scan or search a food product and instantly find out whether it contains your allergens, based on the active profile.',
    dataTitle: 'Data',
    dataBody1: 'Product data comes from ',
    dataBody2:
      ', made available under the Open Database License (ODbL): it can contain errors and should not be used for medical purposes. Ingredients are translated with MyMemory when needed. Profiles and history stay on this device only (localStorage): no account, no server.',
    privacyRowTitle: 'Privacy',
    termsRowTitle: 'Terms & Liability',
    githubLabel: 'Source code on GitHub',
    installTitle: 'Install the app',
    installBody: 'Add AllergyVerify to your Home Screen to use it like a real app, offline too.',
    installCta: 'Install',
    installCtaGuide: 'How to do it',
    installBody1:
      'AllergyVerify can be added to your Home screen like a real app: on iPhone tap ',
    installIos: 'Share → Add to Home Screen',
    installBody2: '; on Android use the install banner or the browser menu (',
    installAndroid: 'Install app',
    installBody3: ').',
    warningTitle: 'Warning',
    warningBody:
      'Information may be incomplete, inaccurate or out of date, and does not replace medical advice or the product label: if you have severe allergies, always check the label. See Terms & Liability above for the full text.',
  },
  installBanner: {
    title: 'Install AllergyVerify',
    body: 'Add it to your Home Screen: it opens full-screen and works offline too.',
    cta: 'Install',
    ctaGuide: 'How to do it',
    continueCta: 'Continue',
    dismissAria: 'Close the install banner',
  },
  installGuide: {
    title: 'Add to Home Screen',
    step1: 'Tap Share',
    step2: 'Tap "Add to Home Screen"',
    gotIt: 'Got it',
  },
  productDetail: {
    back: 'Back',
    loading: 'Loading product…',
    nutrimentsTitle: 'Nutrition facts',
    per100g: '/ 100 g',
    nutrimentsUnavailable: 'Nutrition facts not available for this product.',
    levelTitle: (label: string) => `Level: ${label}`,
    levelLegend:
      'The dot shows whether the amount per 100 g is low, moderate or high relative to European reference nutritional thresholds.',
    levels: { low: 'low', moderate: 'moderate', high: 'high' },
    nutriments: {
      energy: 'Energy',
      carbohydrates: 'Carbohydrates',
      sugars: 'Sugars',
      fat: 'Fat',
      saturatedFat: 'Saturated fat',
      proteins: 'Protein',
      fiber: 'Fiber',
      salt: 'Salt',
      sodium: 'Sodium',
    },
    errors: {
      'not-found': 'Product not found in the Open Food Facts database.',
      offline: 'You are offline: connect to the internet and try again.',
      timeout: 'The request took too long. Try again.',
      error: 'An error occurred while loading the product.',
    },
    disclaimer1: "For guidance only — doesn't replace the label. ",
    disclaimerLink: 'Terms',
  },
  scores: {
    nutriHint: 'Nutritional quality',
    novaHint: 'Processing level',
    greenHint: 'Environmental impact',
    nutriAbout:
      'Summarizes nutritional quality per 100 g: penalizes calories, sugars, saturated fat and salt, rewards fiber and protein. A = best, E = worst.',
    novaAbout:
      'Indicates how industrially processed a food is, not how healthy it is. 1 = unprocessed, 4 = ultra-processed.',
    greenAbout:
      "Estimates the product's environmental impact across its whole life cycle: production, transport and packaging. A = lowest impact, F = highest.",
    nutriMeanings: {
      a: 'Excellent nutritional quality.',
      b: 'Good nutritional quality.',
      c: 'Average nutritional quality.',
      d: 'Poor nutritional quality.',
      e: 'Very poor nutritional quality.',
    },
    novaMeanings: {
      1: 'Unprocessed or minimally processed food (e.g. fruit, milk, legumes).',
      2: 'Processed culinary ingredient (e.g. oil, butter, sugar, salt).',
      3: 'Processed food (e.g. bread, cheeses, canned vegetables).',
      4: 'Ultra-processed food: contains industrial ingredients or processes (emulsifiers, flavorings, colorings…).',
    },
    greenMeanings: {
      a: 'Very low environmental impact.',
      b: 'Low environmental impact.',
      c: 'Moderate environmental impact.',
      d: 'High environmental impact.',
      e: 'Very high environmental impact.',
      f: 'Extremely high environmental impact.',
    },
    dataBy: 'Scores computed by Open Food Facts.',
  },
  allergyBanner: {
    noProfileTitle: 'No active profile',
    noProfileBody: 'Create an allergy profile to get a personalized verdict.',
    noDataTitle: 'Insufficient data',
    noDataBody:
      "The product has no ingredients or allergen list: we can't tell, check the label.",
    dangerTitle: (name: string) => `Warning, ${name}!`,
    contains: (list: string) => `Contains: ${list}`,
    containsLabel: 'Contains',
    safeWithTracesTitle: 'None of your allergens in the ingredients',
    safeWithTracesBody: 'But watch out for the possible traces below.',
    tracesTitle: 'Possible traces',
    mayContain: (list: string) => `May contain: ${list}`,
    mayContainLabel: 'May contain',
    safeTitle: 'None of your allergens detected',
    safeBody: (name: string) =>
      `Safe for the "${name}" profile according to available data.`,
    multiSummaryDanger: (n: number, tot: number) =>
      `Allergens for ${n} of ${tot} profile${tot === 1 ? '' : 's'}`,
    multiSummaryTraces: (n: number, tot: number) =>
      `Possible traces for ${n} of ${tot} profile${tot === 1 ? '' : 's'}`,
    multiSummarySafe: (tot: number) => `No allergens for the ${tot} active profiles`,
    multiRowSafe: 'No allergens',
  },
  ingredients: {
    title: 'Ingredients',
    showAll: 'Show all',
    showLess: 'Show less',
    unavailable: 'Ingredient list not available for this product.',
    translating: 'Translating…',
    badges: {
      vegan: 'Vegan',
      'non-vegan': 'Not vegan',
      vegetarian: 'Vegetarian',
      'non-vegetarian': 'Not vegetarian',
      'palm-oil-free': 'Palm oil free',
      'palm-oil': 'Contains palm oil',
    },
    additivesTitle: 'Additives',
    noAdditives: 'No additives reported.',
  },
  privacy: {
    title: 'Privacy',
    updated: 'Last updated: August 18, 2026',
    intro:
      "AllergyVerify is built to not collect data: there's no account, no server that stores your information. This page explains in detail what happens to your data while you use the app.",
    controllerTitle: 'Data controller',
    controllerBody:
      'The project is run by AllergyVerify. For any question about this notice or your data, write to ',
    contactEmail: 'AllergyVerify@protonmail.com',
    dataTitle: 'Your data stays on your device',
    dataBody:
      "Allergy profiles and scan history are saved only in your browser's local storage (localStorage). They are never sent to a server: if you uninstall the app or clear the site data, they're gone and no one has a copy, not even us.",
    thirdPartiesTitle: 'Third-party services used by the app',
    thirdPartiesIntro:
      'To work, AllergyVerify talks to these external services, which may receive your IP address under their own policies:',
    thirdParties: [
      {
        name: 'Open Food Facts',
        body: 'provides product data when you search or scan a barcode.',
      },
      {
        name: 'MyMemory',
        body: 'automatically translates ingredient text when needed.',
      },
      {
        name: 'Vercel',
        body: 'hosts the site: like any hosting provider, it logs standard technical access data (e.g. IP address) in server logs.',
      },
    ],
    cookiesTitle: 'No tracking cookies',
    cookiesBody:
      'AllergyVerify does not use profiling cookies or any analytics/advertising tools. The localStorage described above is only used to run the app (saving profiles and history) and does not require consent.',
    rightsTitle: 'Your rights',
    rightsBody:
      "You can delete all your data at any time on your own, by clearing the site data in your browser settings: no request needed, since we don't keep a copy. For any question, write to the address above.",
  },
  terms: {
    title: 'Terms & Liability',
    updated: 'Last updated: August 18, 2026',
    intro:
      'By using AllergyVerify you accept these terms. Read them carefully: they concern your allergies.',
    purposeTitle: 'What the app is for',
    purposeBody:
      "AllergyVerify helps you quickly check whether a product contains your allergens, by comparing available data with your profile. It's a support tool, not a replacement: the definitive source is always the physical label of the product in your hand.",
    accuracyTitle: 'No guarantee on the data',
    accuracyBody:
      'Product data comes from Open Food Facts, an open collaborative database: it can be missing, out of date, or entered incorrectly by contributors. Automatic ingredient translation can also contain inaccuracies. AllergyVerify does not verify or guarantee the accuracy of this information.',
    medicalTitle: 'Not medical advice',
    medicalBody:
      "AllergyVerify is not a medical device and does not provide medical advice. If in doubt, or in case of severe allergies or reactions, always consult a doctor and don't rely on the app alone.",
    liabilityTitle: 'Limitation of liability',
    liabilityBody:
      'You use the app at your own risk. To the extent permitted by law, the developer of AllergyVerify is not liable for any consequences — including allergic reactions — arising from missing, incorrect or outdated data in the third-party sources the app relies on.',
    licenseTitle: 'Data license',
    licenseBody:
      'Product data comes from Open Food Facts (openfoodfacts.org), made available under the Open Database License (ODbL) v1.0. The information is provided for indicative purposes only, may contain errors, and should not be used for medical purposes.',
    changesTitle: 'Changes to these terms',
    changesBody:
      'These terms may change in the future, for example if the app adds new features. The date above shows the latest update.',
  },
}

export const translations: Record<Lang, Translations> = { it, en }
