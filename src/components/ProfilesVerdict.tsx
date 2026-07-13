import { labelForTag, matchAllergens } from '../data/allergenCatalog'
import { useAllergyProfile } from '../hooks/useAllergyProfile'
import { useLang } from '../i18n/useLang'
import type { Lang, Translations } from '../i18n/translations'
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
          return (
            <li
              key={p.id}
              className={`flex flex-col gap-0.5 rounded-xl border px-3 py-2 ${
                active ? 'border-accent/40 bg-surface-2' : 'border-edge bg-surface-2/50'
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
              <span className={`text-xs font-medium ${v.color}`}>
                {v.icon} {v.text}
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
) {
  const toLabels = (tags: string[]) =>
    tags.map((tag) => labelForTag(tag, lang)).join(', ')

  if (!product.allergens_tags) {
    return { icon: '⚪', text: t.profilesVerdict.noData, color: 'text-ink-dim' }
  }
  const detected = matchAllergens(product.allergens_tags, allergens)
  if (detected.length > 0) {
    return {
      icon: '🔴',
      text: t.profilesVerdict.contains(toLabels(detected)),
      color: 'text-danger',
    }
  }
  const traces = matchAllergens(product.traces_tags, allergens)
  if (traces.length > 0) {
    return {
      icon: '🟠',
      text: t.profilesVerdict.traces(toLabels(traces)),
      color: 'text-warn',
    }
  }
  return { icon: '🟢', text: t.profilesVerdict.ok, color: 'text-accent' }
}
