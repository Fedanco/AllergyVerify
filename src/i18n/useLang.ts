import { useCallback, useSyncExternalStore } from 'react'
import { translations, type Lang } from './translations'

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

/** Lingua attiva, setter e dizionario `t` della lingua corrente. */
export function useLang() {
  const snapshot = useSyncExternalStore(subscribe, () => lang)
  const setLang = useCallback((next: Lang) => commit(next), [])
  return { lang: snapshot, setLang, t: translations[snapshot] }
}
