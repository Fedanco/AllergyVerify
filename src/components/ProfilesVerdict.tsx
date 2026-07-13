import { labelForTag, matchAllergens } from '../data/allergenCatalog'
import { useAllergyProfile } from '../hooks/useAllergyProfile'
import type { Product } from '../types/product'

/**
 * Confronto multi-profilo: una riga di verdetto per ogni profilo salvato.
 * Visibile solo con almeno 2 profili; il banner grande resta per l'attivo.
 */
export default function ProfilesVerdict({ product }: { product: Product }) {
  const { profiles, activeProfile } = useAllergyProfile()
  if (profiles.length < 2) return null

  return (
    <section className="card p-4">
      <h2 className="mb-3 text-sm font-semibold text-ink-dim">Tutti i profili</h2>
      <ul className="flex flex-col gap-2">
        {profiles.map((p) => {
          const v = verdictFor(product, p.allergens)
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
                  <span className="shrink-0 text-[0.65rem] text-accent">attivo</span>
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

function verdictFor(product: Product, allergens: string[]) {
  if (!product.allergens_tags) {
    return { icon: '⚪', text: 'Dati mancanti', color: 'text-ink-dim' }
  }
  const detected = matchAllergens(product.allergens_tags, allergens)
  if (detected.length > 0) {
    return {
      icon: '🔴',
      text: `Contiene: ${detected.map(labelForTag).join(', ')}`,
      color: 'text-danger',
    }
  }
  const traces = matchAllergens(product.traces_tags, allergens)
  if (traces.length > 0) {
    return {
      icon: '🟠',
      text: `Tracce: ${traces.map(labelForTag).join(', ')}`,
      color: 'text-warn',
    }
  }
  return { icon: '🟢', text: 'OK', color: 'text-accent' }
}
