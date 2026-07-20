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
    denied:
      "Accesso alla fotocamera negato. Consenti l'uso della fotocamera nelle impostazioni del browser e ricarica la pagina.",
    unavailable:
      'Fotocamera non disponibile su questo dispositivo. Usa la ricerca manuale.',
    hint: 'Il codice viene riconosciuto automaticamente: nessuno scatto necessario.',
    searchInstead: 'Vai alla ricerca manuale',
  },
  history: {
    title: 'Storico',
    subtitle: (n: number) =>
      `${n} prodott${n === 1 ? 'o' : 'i'} tra scansioni e ricerche`,
    clear: 'Svuota',
    confirmClear: 'Svuotare tutto lo storico?',
    empty: 'Lo storico è vuoto: i prodotti che scansioni o cerchi appariranno qui.',
    sourceScan: '📷 Scansione',
    sourceSearch: '🔍 Ricerca',
    dateLocale: 'it-IT',
  },
  profile: {
    title: 'Profili allergie',
    subtitle: 'Il profilo attivo viene usato per il verdetto sui prodotti',
    noAllergens: 'Nessun allergene selezionato',
    edit: 'Modifica',
    confirmDelete: (name: string) => `Eliminare il profilo "${name}"?`,
    deleteAria: (name: string) => `Elimina profilo ${name}`,
    newProfile: '+ Nuovo profilo',
    editorTitleEdit: (name: string) => `Modifica "${name}"`,
    editorTitleNew: 'Nuovo profilo',
    nameLabel: 'Nome',
    namePlaceholder: 'Nome (es. Valentina)',
    allergensLabel: 'I tuoi allergeni (14 allergeni UE):',
    save: 'Salva profilo',
    cancel: 'Annulla',
  },
  settings: {
    title: 'Info',
    subtitle: 'AllergyScan Web',
    languageTitle: 'Lingua',
    aboutTitle: "Che cos'è",
    aboutBody:
      'Versione web di AllergyScan: scansiona o cerca un prodotto alimentare e scopri subito se contiene i tuoi allergeni, in base al profilo attivo.',
    dataTitle: 'Dati',
    dataBody1: 'I dati dei prodotti provengono da ',
    dataBody2:
      ', il database alimentare libero e collaborativo. Profili e storico restano solo su questo dispositivo (localStorage): nessun account, nessun server.',
    installTitle: "Installa l'app",
    installBody1:
      'AllergyScan si può aggiungere alla schermata Home come una vera app: su iPhone tocca ',
    installIos: 'Condividi → Aggiungi alla schermata Home',
    installBody2:
      '; su Android usa il banner di installazione o il menu del browser (',
    installAndroid: 'Installa app',
    installBody3: ').',
    warningTitle: 'Attenzione',
    warningBody:
      "Le informazioni potrebbero essere incomplete o non aggiornate: in caso di allergie gravi, verifica sempre l'etichetta del prodotto.",
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
    noDataTitle: 'Dati allergeni non disponibili',
    noDataBody: "Il prodotto non riporta l'elenco allergeni: verifica l'etichetta.",
    dangerTitle: (name: string) => `Attenzione, ${name}!`,
    contains: (list: string) => `Contiene: ${list}`,
    safeWithTracesTitle: 'Nessun tuo allergene tra gli ingredienti',
    safeWithTracesBody: 'Occhio però alle possibili tracce qui sotto.',
    tracesTitle: 'Possibili tracce',
    mayContain: (list: string) => `Può contenere: ${list}`,
    safeTitle: 'Nessun tuo allergene rilevato',
    safeBody: (name: string) =>
      `Sicuro per il profilo "${name}" secondo i dati disponibili.`,
  },
  profilesVerdict: {
    title: 'Tutti i profili',
    active: 'attivo',
    noData: 'Dati mancanti',
    contains: (list: string) => `Contiene: ${list}`,
    traces: (list: string) => `Tracce: ${list}`,
    ok: 'OK',
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
    denied:
      'Camera access denied. Allow camera access in your browser settings and reload the page.',
    unavailable: 'Camera not available on this device. Use manual search instead.',
    hint: 'The barcode is recognized automatically: no need to take a picture.',
    searchInstead: 'Go to manual search',
  },
  history: {
    title: 'History',
    subtitle: (n: number) =>
      `${n} product${n === 1 ? '' : 's'} from scans and searches`,
    clear: 'Clear',
    confirmClear: 'Clear all history?',
    empty: 'History is empty: products you scan or search will appear here.',
    sourceScan: '📷 Scan',
    sourceSearch: '🔍 Search',
    dateLocale: 'en-US',
  },
  profile: {
    title: 'Allergy profiles',
    subtitle: 'The active profile is used for product verdicts',
    noAllergens: 'No allergens selected',
    edit: 'Edit',
    confirmDelete: (name: string) => `Delete profile "${name}"?`,
    deleteAria: (name: string) => `Delete profile ${name}`,
    newProfile: '+ New profile',
    editorTitleEdit: (name: string) => `Edit "${name}"`,
    editorTitleNew: 'New profile',
    nameLabel: 'Name',
    namePlaceholder: 'Name (e.g. Valentina)',
    allergensLabel: 'Your allergens (14 EU allergens):',
    save: 'Save profile',
    cancel: 'Cancel',
  },
  settings: {
    title: 'Info',
    subtitle: 'AllergyScan Web',
    languageTitle: 'Language',
    aboutTitle: 'What it is',
    aboutBody:
      'Web version of AllergyScan: scan or search a food product and instantly find out whether it contains your allergens, based on the active profile.',
    dataTitle: 'Data',
    dataBody1: 'Product data comes from ',
    dataBody2:
      ', the free collaborative food database. Profiles and history stay on this device only (localStorage): no account, no server.',
    installTitle: 'Install the app',
    installBody1:
      'AllergyScan can be added to your Home screen like a real app: on iPhone tap ',
    installIos: 'Share → Add to Home Screen',
    installBody2: '; on Android use the install banner or the browser menu (',
    installAndroid: 'Install app',
    installBody3: ').',
    warningTitle: 'Warning',
    warningBody:
      'Information may be incomplete or out of date: if you have severe allergies, always check the product label.',
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
    noDataTitle: 'Allergen data not available',
    noDataBody: "The product doesn't list its allergens: check the label.",
    dangerTitle: (name: string) => `Warning, ${name}!`,
    contains: (list: string) => `Contains: ${list}`,
    safeWithTracesTitle: 'None of your allergens in the ingredients',
    safeWithTracesBody: 'But watch out for the possible traces below.',
    tracesTitle: 'Possible traces',
    mayContain: (list: string) => `May contain: ${list}`,
    safeTitle: 'None of your allergens detected',
    safeBody: (name: string) =>
      `Safe for the "${name}" profile according to available data.`,
  },
  profilesVerdict: {
    title: 'All profiles',
    active: 'active',
    noData: 'No data',
    contains: (list: string) => `Contains: ${list}`,
    traces: (list: string) => `Traces: ${list}`,
    ok: 'OK',
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
}

export const translations: Record<Lang, Translations> = { it, en }
