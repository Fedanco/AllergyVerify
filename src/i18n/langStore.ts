import { useCallback, useSyncExternalStore } from 'react'

export type Lang = 'it' | 'en'

const LANG_KEY = 'as_lang'

let lang: Lang = load()
const listeners = new Set<() => void>()

function load(): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY)
    if (stored === 'it' || stored === 'en') return stored
  } catch {
    // localStorage non disponibile
  }
  // Al primo avvio l'app parte in inglese: è la lingua che serve a chiunque
  // non sia italiano, e chi lo è la cambia una volta sola da Info → Lingua
  // (la scelta resta salvata). Prima il default era l'italiano.
  return 'en'
}

// document.documentElement.lang guida la pronuncia di uno screen reader:
// senza aggiornarlo resterebbe fisso sul valore statico di index.html anche
// passando all'inglese.
document.documentElement.lang = lang

function commit(next: Lang) {
  lang = next
  document.documentElement.lang = next
  try {
    localStorage.setItem(LANG_KEY, next)
  } catch {
    // storage non disponibile: la scelta vale solo per la sessione
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Solo lingua attiva e setter, senza dizionario: è la parte dello store che
 * condividono app e landing (stessa chiave `as_lang`, quindi la scelta fatta
 * sulla landing vale anche aprendo l'app). La landing ha un dizionario suo e
 * non deve trascinarsi nel bundle tutto `translations.ts`.
 */
export function useLangStore() {
  const snapshot = useSyncExternalStore(subscribe, () => lang)
  const setLang = useCallback((next: Lang) => commit(next), [])
  return { lang: snapshot, setLang }
}
