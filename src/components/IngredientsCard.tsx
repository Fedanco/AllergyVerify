import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { translateIngredients } from '../api/translate'
import {
  ALLERGEN_KEYWORDS,
  isNegatedAllergenMatch,
  keywordPattern,
  normalizeTag,
} from '../data/allergenCatalog'
import { useLang } from '../i18n/useLang'
import type { Product } from '../types/product'

const ANALYSIS_BADGES = [
  { tag: 'vegan', emoji: '🌱' },
  { tag: 'non-vegan', emoji: '🥩' },
  { tag: 'vegetarian', emoji: '🥚' },
  { tag: 'non-vegetarian', emoji: '🍖' },
  { tag: 'palm-oil-free', emoji: '🌴' },
  { tag: 'palm-oil', emoji: '🌴' },
] as const

interface Props {
  product: Product
  /** allergeni da evidenziare: l'unione di quelli dei profili attivi */
  allergens: string[]
}

export default function IngredientsCard({ product, allergens }: Props) {
  const { lang, t } = useLang()
  const [expanded, setExpanded] = useState(false)
  // il testo eccede davvero le 4 righe del clamp? (misurato, non stimato)
  const [clamped, setClamped] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  // Testo già nella lingua dell'app: l'etichetta originale se il prodotto
  // è di quel mercato (product.lang), oppure il campo _it (storicamente
  // affidabile). Il campo _en dei prodotti non anglofoni è spesso OCR di
  // bassa qualità su OFF: meglio tradurre dall'originale.
  const nativeText =
    (product.lang === lang ? product.ingredients_text?.trim() : undefined) ||
    (lang === 'it' ? product.ingredients_text_it?.trim() : undefined)
  // sorgente per la traduzione: il testo originale, poi gli altri campi
  const fallbackText =
    product.ingredients_text?.trim() ||
    product.ingredients_text_it?.trim() ||
    product.ingredients_text_en?.trim()
  const text = nativeText || fallbackText

  const [displayText, setDisplayText] = useState(text)
  const [translating, setTranslating] = useState(false)

  useEffect(() => {
    setDisplayText(text)
    if (!text || nativeText) return
    let cancelled = false
    setTranslating(true)
    translateIngredients(product.code, text, lang).then((res) => {
      if (cancelled) return
      setTranslating(false)
      if (res.translated) setDisplayText(res.text)
    })
    return () => {
      cancelled = true
      setTranslating(false)
    }
  }, [text, nativeText, lang, product.code])

  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const measure = () => {
      // con line-clamp attivo scrollHeight > clientHeight solo se c'è testo tagliato
      if (!expanded) setClamped(el.scrollHeight > el.clientHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [displayText, expanded])

  const additives = (product.additives_tags ?? []).map((t) =>
    normalizeTag(t).toUpperCase(),
  )
  const analysisTags = new Set(
    (product.ingredients_analysis_tags ?? []).map(normalizeTag),
  )
  const badges = ANALYSIS_BADGES.filter((b) => analysisTags.has(b.tag))

  if (!text && additives.length === 0 && badges.length === 0) return null

  return (
    <section className="card p-4">
      <h2 className="mb-3 text-[0.7rem] font-bold tracking-[0.12em] text-ink-soft uppercase">{t.ingredients.title}</h2>

      {displayText ? (
        <>
          <p
            ref={textRef}
            className={`text-sm leading-relaxed text-ink ${
              expanded ? '' : 'line-clamp-4'
            }`}
          >
            {highlightAllergens(displayText, allergens)}
          </p>
          {translating && (
            <p className="mt-1 text-[0.65rem] text-ink-soft">
              {t.ingredients.translating}
            </p>
          )}
          {(clamped || expanded) && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((e) => !e)}
              className="focus-ring mt-2 text-xs font-bold text-blue underline underline-offset-4"
            >
              {expanded ? t.ingredients.showLess : t.ingredients.showAll}
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-ink-soft">{t.ingredients.unavailable}</p>
      )}

      {badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {badges.map((b) => (
            <span key={b.tag} className="chip px-2.5 py-1 text-xs font-bold text-ink-soft">
              {b.emoji} {t.ingredients.badges[b.tag]}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-edge pt-3">
        <h3 className="mb-2 text-[0.7rem] font-bold tracking-[0.12em] text-ink-soft uppercase">{t.ingredients.additivesTitle}</h3>
        {additives.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {additives.map((a) => (
              <span key={a} className="chip px-2 py-0.5 text-xs font-bold text-ink-soft">
                {a}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink-soft">{t.ingredients.noAdditives}</p>
        )}
      </div>
    </section>
  )
}

/** Evidenzia nel testo le parole legate agli allergeni del profilo. */
function highlightAllergens(text: string, allergens: string[]): React.ReactNode {
  if (allergens.length === 0) return text

  const words = allergens
    .flatMap((tag) => ALLERGEN_KEYWORDS[tag] ?? [])
    .sort((a, b) => b.length - a.length) // match più lunghi per primi
  if (words.length === 0) return text

  // Le occorrenze negate ("Senza glutine") vengono saltate, come nel verdetto:
  // se il banner dice che il glutine non c'è, evidenziarlo qui in rosso
  // racconterebbe il contrario nella stessa schermata.
  const re = keywordPattern(words)
  const out: React.ReactNode[] = []
  let last = 0
  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    if (isNegatedAllergenMatch(text, m.index, m[0].length)) continue
    if (m.index > last) out.push(text.slice(last, m.index))
    out.push(
      /* Sottolineatura a pennarello, in CSS: un tratto pieno da 3px sotto la
         parola. Niente SVG filtrato per ogni allergene (si rifarebbe a ogni
         cambio del testo tradotto e non andrebbe a capo dentro la frase). */
      <mark
        key={m.index}
        className="bg-transparent font-bold text-inherit underline decoration-red decoration-[3px] underline-offset-[3px] [text-decoration-skip-ink:none]"
      >
        {m[0]}
      </mark>,
    )
    last = m.index + m[0].length
  }
  if (last === 0) return text
  if (last < text.length) out.push(text.slice(last))
  return out
}
