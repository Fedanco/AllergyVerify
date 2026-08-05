import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { translateIngredients } from '../api/translate'
import { ALLERGEN_KEYWORDS, normalizeTag } from '../data/allergenCatalog'
import { useLang } from '../i18n/useLang'
import type { AllergyProfile, Product } from '../types/product'

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
  profile: AllergyProfile | null
}

export default function IngredientsCard({ product, profile }: Props) {
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
      <h2 className="mb-3 text-sm font-semibold text-ink-dim">{t.ingredients.title}</h2>

      {displayText ? (
        <>
          <p
            ref={textRef}
            className={`text-sm leading-relaxed text-ink ${
              expanded ? '' : 'line-clamp-4'
            }`}
          >
            {highlightAllergens(displayText, profile)}
          </p>
          {translating && (
            <p className="mt-1 text-[0.65rem] text-ink-dim/60">
              {t.ingredients.translating}
            </p>
          )}
          {(clamped || expanded) && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((e) => !e)}
              className="focus-ring mt-2 rounded text-xs font-medium text-accent"
            >
              {expanded ? t.ingredients.showLess : t.ingredients.showAll}
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-ink-dim">{t.ingredients.unavailable}</p>
      )}

      {badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {badges.map((b) => (
            <span key={b.tag} className="chip rounded-full px-3 py-1 text-xs text-ink-dim">
              {b.emoji} {t.ingredients.badges[b.tag]}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-edge pt-3">
        <h3 className="mb-2 text-xs font-semibold text-ink-dim">{t.ingredients.additivesTitle}</h3>
        {additives.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {additives.map((a) => (
              <span key={a} className="chip rounded-md px-2 py-0.5 font-mono text-xs text-ink-dim">
                {a}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink-dim">{t.ingredients.noAdditives}</p>
        )}
      </div>
    </section>
  )
}

/** Evidenzia nel testo le parole legate agli allergeni del profilo. */
function highlightAllergens(
  text: string,
  profile: AllergyProfile | null,
): React.ReactNode {
  if (!profile || profile.allergens.length === 0) return text

  const words = profile.allergens
    .flatMap((tag) => ALLERGEN_KEYWORDS[tag] ?? [])
    .sort((a, b) => b.length - a.length) // match più lunghi per primi
  if (words.length === 0) return text

  const pattern = new RegExp(
    `(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi',
  )

  return text.split(pattern).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-danger/20 px-0.5 font-semibold text-danger">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}
