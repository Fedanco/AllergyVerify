import { translations } from './translations'
import { useLangStore } from './langStore'

/** Lingua attiva, setter e dizionario `t` della lingua corrente. */
export function useLang() {
  const { lang, setLang } = useLangStore()
  return { lang, setLang, t: translations[lang] }
}
