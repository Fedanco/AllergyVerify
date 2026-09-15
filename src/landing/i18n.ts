import type { Lang } from '../i18n/langStore'

/**
 * Dizionario della sola landing, separato da `translations.ts` dell'app: la
 * landing non deve trascinarsi nel bundle il dizionario intero dell'app, e
 * l'app non ha bisogno dei testi della landing. Stessa regola: `it` è la
 * sorgente, `en` deve avere le stesse chiavi (interfaccia esplicita).
 */

export type Tone = 'red' | 'wheat' | 'green'

export interface Segment {
  text: string
  /** Colore della sottolineatura a pennarello, se il segmento va evidenziato. */
  mark?: 'red' | 'wheat'
}

export interface LandingDict {
  nav: { how: string; verdict: string; inside: string; open: string; langLabel: string }
  hero: {
    line1: string
    line2Lead: string
    line2Mark: string
    body: string
    cta: string
    example: string
    logoAlt: string
  }
  how: { title: string; body: string }
  steps: { stamp: string; title: string; body: string }[]
  install: { stamp: string; title: string; body: string; ios: string; android: string }
  verdict: {
    title: string
    body: string
    mock: {
      product: string
      barcode: string
      summary: string
      people: { name: string; tone: Tone; stamp: string; detail: string }[]
      ingredientsTitle: string
      ingredients: Segment[]
    }
  }
  inside: {
    title: string
    body: string
    ingredientsStamp: string
    items: { name: string; note: string }[]
    withoutStamp: string
    without: string
    valuesTitle: string
    values: [string, string][]
    storage: string
  }
  warning: { stamp: string; body: string }
  footer: {
    privacy: string
    terms: string
    github: string
    data: string
    made: string
  }
}

const it: LandingDict = {
  nav: {
    how: 'Come funziona',
    verdict: 'Verdetto',
    inside: "Cosa c'è dentro",
    open: "Apri l'app",
    langLabel: 'Lingua',
  },
  hero: {
    line1: "Leggi l'etichetta.",
    line2Lead: 'Prima del',
    line2Mark: 'morso.',
    body:
      'AllergyVerify legge il codice a barre di un prodotto e ti dice subito se contiene i tuoi allergeni. Gratis, senza account: tutto resta sul tuo telefono.',
    cta: "Apri l'app",
    example: 'Guarda un esempio',
    logoAlt:
      "Logo di AllergyVerify: una spiga di grano sotto una lente d'ingrandimento, con un badge d'allerta",
  },
  how: {
    title: 'Come funziona',
    body: 'Tre passi e nessun account: si apre nel browser e in pochi secondi hai il verdetto.',
  },
  steps: [
    {
      stamp: 'Scansiona',
      title: 'Inquadra il codice',
      body: 'Con la fotocamera del telefono, o cercando il prodotto per nome. Niente da scaricare: si apre nel browser.',
    },
    {
      stamp: 'Verifica',
      title: 'Un verdetto a persona',
      body: 'Rosso se contiene un tuo allergene, giallo se ci sono tracce, verde se puoi mangiarlo. Una tessera per ogni profilo attivo.',
    },
    {
      stamp: 'Leggi',
      title: 'Ingredienti evidenziati',
      body: "L'allergene è sottolineato nella lista, tradotta nella tua lingua. Verdetto e testo dicono la stessa cosa.",
    },
  ],
  install: {
    stamp: 'Installa',
    title: 'Mettila in Home',
    body: "Si installa come un'app vera: schermo intero, icona in Home, funziona anche senza rete.",
    ios: 'iPhone: Condividi → Aggiungi alla schermata Home',
    android: 'Android: menu del browser → Installa app',
  },
  verdict: {
    title: 'Una spesa, tre persone, un verdetto ciascuno.',
    body: 'In famiglia ognuno ha le sue allergie, e la spesa è una sola. Attiva più profili insieme: per ogni prodotto vedi chi può mangiarlo e chi no, prima ancora di leggere i nomi.',
    mock: {
      product: 'Biscotti con gocce di cioccolato',
      barcode: '8 001234 567890',
      summary: 'Allergeni per 2 profili su 3',
      people: [
        { name: 'Anna', tone: 'red', stamp: 'Contiene', detail: '🌾 Glutine' },
        { name: 'Luca', tone: 'wheat', stamp: 'Tracce', detail: '🌰 Frutta a guscio' },
        { name: 'Sara', tone: 'green', stamp: 'Ok', detail: 'Nessun allergene' },
      ],
      ingredientsTitle: 'Ingredienti',
      ingredients: [
        { text: 'Farina di ' },
        { text: 'grano', mark: 'red' },
        {
          text: ' tenero, zucchero, olio di girasole, gocce di cioccolato 12% (zucchero, pasta di cacao, burro di cacao), sciroppo di glucosio, agenti lievitanti, sale, aroma. Può contenere ',
        },
        { text: 'frutta a guscio', mark: 'wheat' },
        { text: '.' },
      ],
    },
  },
  inside: {
    title: "Cosa c'è dentro",
    body: "Un'etichetta anche per noi. Da leggere per intero, come si dovrebbe fare con tutte.",
    ingredientsStamp: 'Ingredienti',
    items: [
      { name: 'Profili famiglia', note: 'uno per persona, attivi insieme' },
      { name: '14 allergeni', note: "quelli regolamentati dall'UE" },
      { name: 'Storico', note: 'di scansioni e ricerche' },
      { name: 'Offline', note: 'una volta installata' },
      { name: 'Italiano e inglese', note: 'con ingredienti tradotti' },
      { name: 'Open Food Facts', note: 'il database alimentare aperto' },
    ],
    withoutStamp: 'Senza',
    without: 'Non contiene: account, server, pubblicità, costi.',
    valuesTitle: 'Valori medi per 100 g di spesa',
    values: [
      ['Prezzo', '0 €'],
      ['Account richiesti', '0'],
      ['Dati inviati a un server', '0'],
      ['Allergeni controllati', '14'],
      ['Profili attivi insieme', 'quanti vuoi'],
    ],
    storage: 'Conservare sul proprio telefono. Nessuna scadenza.',
  },
  warning: {
    stamp: 'Attenzione',
    body: "Le informazioni possono essere incomplete, errate o non aggiornate, e non sostituiscono il parere medico né l'etichetta del prodotto: in caso di allergie gravi, verifica sempre la confezione.",
  },
  footer: {
    privacy: 'Privacy',
    terms: 'Termini e responsabilità',
    github: 'Codice su GitHub',
    data: 'Dati dei prodotti da Open Food Facts, licenza ODbL.',
    made: 'Nessun cookie, nessun tracciamento. Fatta con carta e pennarello.',
  },
}

const en: LandingDict = {
  nav: {
    how: 'How it works',
    verdict: 'Verdict',
    inside: "What's inside",
    open: 'Open the app',
    langLabel: 'Language',
  },
  hero: {
    line1: 'Read the label.',
    line2Lead: 'Before the',
    line2Mark: 'bite.',
    body: "AllergyVerify reads a product's barcode and tells you right away whether it contains your allergens. Free, no account: everything stays on your phone.",
    cta: 'Open the app',
    example: 'See an example',
    logoAlt:
      'AllergyVerify logo: an ear of wheat under a magnifying glass, with an alert badge',
  },
  how: {
    title: 'How it works',
    body: 'Three steps and no account: it opens in the browser and you get the verdict in seconds.',
  },
  steps: [
    {
      stamp: 'Scan',
      title: 'Frame the barcode',
      body: 'With your phone camera, or by searching the product by name. Nothing to download: it opens in the browser.',
    },
    {
      stamp: 'Verify',
      title: 'One verdict per person',
      body: 'Red if it contains one of your allergens, yellow for traces, green if you can eat it. One tile for every active profile.',
    },
    {
      stamp: 'Read',
      title: 'Ingredients, highlighted',
      body: 'The allergen is underlined in the list, translated into your language. Verdict and text say the same thing.',
    },
  ],
  install: {
    stamp: 'Install',
    title: 'Put it on your Home Screen',
    body: 'It installs like a real app: full screen, an icon on the Home Screen, and it works without a connection too.',
    ios: 'iPhone: Share → Add to Home Screen',
    android: 'Android: browser menu → Install app',
  },
  verdict: {
    title: 'One shopping trip, three people, a verdict for each.',
    body: "Everyone in a family has their own allergies, and there's only one cart. Activate several profiles at once: for every product you see who can eat it and who can't, before you even read the names.",
    mock: {
      product: 'Chocolate chip cookies',
      barcode: '8 001234 567890',
      summary: 'Allergens for 2 of 3 profiles',
      people: [
        { name: 'Anna', tone: 'red', stamp: 'Contains', detail: '🌾 Gluten' },
        { name: 'Luca', tone: 'wheat', stamp: 'Traces', detail: '🌰 Tree nuts' },
        { name: 'Sara', tone: 'green', stamp: 'Ok', detail: 'No allergens' },
      ],
      ingredientsTitle: 'Ingredients',
      ingredients: [
        { text: 'Soft ' },
        { text: 'wheat', mark: 'red' },
        {
          text: ' flour, sugar, sunflower oil, chocolate chips 12% (sugar, cocoa mass, cocoa butter), glucose syrup, raising agents, salt, flavouring. May contain ',
        },
        { text: 'tree nuts', mark: 'wheat' },
        { text: '.' },
      ],
    },
  },
  inside: {
    title: "What's inside",
    body: 'A label for us too. To be read all the way through, as every label should be.',
    ingredientsStamp: 'Ingredients',
    items: [
      { name: 'Family profiles', note: 'one per person, active together' },
      { name: '14 allergens', note: 'the ones regulated by the EU' },
      { name: 'History', note: 'of scans and searches' },
      { name: 'Offline', note: 'once installed' },
      { name: 'Italian and English', note: 'with translated ingredients' },
      { name: 'Open Food Facts', note: 'the open food database' },
    ],
    withoutStamp: 'Free of',
    without: 'Contains no: accounts, servers, ads, fees.',
    valuesTitle: 'Typical values per 100 g of groceries',
    values: [
      ['Price', '€0'],
      ['Accounts required', '0'],
      ['Data sent to a server', '0'],
      ['Allergens checked', '14'],
      ['Profiles active at once', 'as many as you like'],
    ],
    storage: 'Store on your own phone. No expiry date.',
  },
  warning: {
    stamp: 'Warning',
    body: 'Information may be incomplete, inaccurate or out of date, and does not replace medical advice or the product label: if you have severe allergies, always check the packaging.',
  },
  footer: {
    privacy: 'Privacy',
    terms: 'Terms & Liability',
    github: 'Code on GitHub',
    data: 'Product data from Open Food Facts, ODbL licence.',
    made: 'No cookies, no tracking. Made with paper and a marker.',
  },
}

export const landingDict: Record<Lang, LandingDict> = { it, en }
