import type { Lang } from './langStore'

/**
 * Testi legali (Privacy, Termini e responsabilità), condivisi tra l'app
 * (`t.privacy`, `t.terms` in translations.ts) e la landing (`/privacy/`,
 * `/terms/`), che non importa il dizionario intero dell'app. Un solo posto da
 * aggiornare, con la data in cima a ogni blocco.
 */

const it = {
  privacy: {
    title: 'Privacy',
    updated: 'Ultimo aggiornamento: 15 settembre 2026',
    intro:
      "AllergyVerify è pensata per non raccogliere dati: non c'è un account, non c'è un server che conserva le tue informazioni. Questa pagina spiega nel dettaglio cosa succede ai tuoi dati mentre usi l'app.",
    controllerTitle: 'Titolare del trattamento',
    controllerBody:
      'Il progetto è gestito da AllergyVerify, senza società né raccolta dati alle spalle. I contatti sono nella sezione in fondo a questa pagina.',
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
      "Puoi cancellare tutti i tuoi dati in autonomia in qualsiasi momento, svuotando i dati del sito dalle impostazioni del browser: non serve chiedere nulla, perché non ne conserviamo copia. Per qualsiasi domanda, vedi la sezione qui sotto.",
    githubTitle: 'GitHub e contatti',
    githubBody:
      'Il codice sorgente e le discussioni pubbliche (issue) sono ospitati su GitHub e soggetti alla privacy policy di GitHub.',
    contactLead: 'Per domande su questa informativa scrivi a ',
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

export type LegalDict = typeof it

const en: LegalDict = {
  privacy: {
    title: 'Privacy',
    updated: 'Last updated: September 15, 2026',
    intro:
      "AllergyVerify is built to not collect data: there's no account, no server that stores your information. This page explains in detail what happens to your data while you use the app.",
    controllerTitle: 'Data controller',
    controllerBody:
      'The project is run by AllergyVerify, with no company and no data collection behind it. Contact details are in the last section of this page.',
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
      "You can delete all your data at any time on your own, by clearing the site data in your browser settings: no request needed, since we don't keep a copy. For any question, see the section below.",
    githubTitle: 'GitHub and contact',
    githubBody:
      "Our source code and public issue discussions are hosted on GitHub and covered by GitHub's privacy policy.",
    contactLead: 'For questions about this policy, write to ',
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

export const legal: Record<Lang, LegalDict> = { it, en }
