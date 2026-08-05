import { checkAllergens, labelForTag } from '../data/allergenCatalog'
import { useAllergyProfile } from '../hooks/useAllergyProfile'
import { useLang } from '../i18n/useLang'
import type { Lang, Translations } from '../i18n/translations'
import { TONE_ICON, TONE_TEXT, type Tone } from '../lib/allergyTone'
import type { Product } from '../types/product'

/**
 * Confronto multi-profilo: una riga di verdetto per ogni profilo salvato.
 * Visibile solo con almeno 2 profili; il banner grande resta per l'attivo.
 */
export default function ProfilesVerdict({ product }: { product: Product }) {
  const { profiles, activeProfile } = useAllergyProfile()
  const { lang, t } = useLang()
  if (profiles.length < 2) return null

  return (
    <section className="card p-4">
      <h2 className="mb-3 text-sm font-semibold text-ink-dim">{t.profilesVerdict.title}</h2>
      <ul className="flex flex-col gap-2">
        {profiles.map((p) => {
          const v = verdictFor(product, p.allergens, lang, t)
          const active = p.id === activeProfile?.id
          const Icon = TONE_ICON[v.tone]
          return (
            <li
              key={p.id}
              className={`card-row flex flex-col gap-0.5 px-3 py-2 ${
                active ? 'border-accent/40' : ''
              }`}
            >
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <span className="truncate">{p.name}</span>
                {active && (
                  <span className="shrink-0 text-[0.65rem] text-accent">
                    {t.profilesVerdict.active}
                  </span>
                )}
              </span>
              <span className={`flex items-center gap-1 text-xs font-medium ${TONE_TEXT[v.tone]}`}>
                <Icon className="h-3.5 w-3.5 shrink-0" /> {v.text}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function verdictFor(
  product: Product,
  allergens: string[],
  lang: Lang,
  t: Translations,
): { tone: Tone; text: string } {
  const toLabels = (tags: string[]) =>
    tags.map((tag) => labelForTag(tag, lang)).join(', ')

  const { detected, traces, hasData } = checkAllergens(product, allergens)
  if (!hasData) {
    return { tone: 'neutral', text: t.profilesVerdict.noData }
  }
  if (detected.length > 0) {
    return { tone: 'danger', text: t.profilesVerdict.contains(toLabels(detected)) }
  }
  if (traces.length > 0) {
    return { tone: 'warn', text: t.profilesVerdict.traces(toLabels(traces)) }
  }
  return { tone: 'safe', text: t.profilesVerdict.ok }
}
