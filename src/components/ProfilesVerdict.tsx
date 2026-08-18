import { checkAllergens, labelForTag } from '../data/allergenCatalog'
import { useAllergyProfile } from '../hooks/useAllergyProfile'
import { useLang } from '../i18n/useLang'
import type { Lang, Translations } from '../i18n/translations'
import { TONE_ICON, TONE_TEXT, type Tone } from '../lib/allergyTone'
import type { Product } from '../types/product'

/**
 * Confronto fra i profili SELEZIONATI: una riga di esito per ciascuno.
 *
 * Solo quelli selezionati, e solo quando sono piu' d'uno: un profilo salvato
 * ma non spuntato non deve comparire da nessuna parte, altrimenti l'app
 * risponde per persone che l'utente non ha chiesto di controllare. Con un
 * solo profilo attivo il verdetto grande dice gia' tutto e questo blocco
 * sparisce.
 */
export default function ProfilesVerdict({ product }: { product: Product }) {
  const { activeProfiles } = useAllergyProfile()
  const { lang, t } = useLang()
  if (activeProfiles.length < 2) return null

  return (
    <section className="card p-4">
      <h2 className="mb-3 text-sm font-semibold text-ink-dim">{t.profilesVerdict.title}</h2>
      <ul className="flex flex-col gap-2">
        {activeProfiles.map((p) => {
          const v = verdictFor(product, p.allergens, lang, t)
          const Icon = TONE_ICON[v.tone]
          return (
            <li key={p.id} className="card-row flex flex-col gap-0.5 px-3 py-2">
              {/* niente badge "attivo": qui sono attivi tutti per definizione */}
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <span className="truncate">{p.name}</span>
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
