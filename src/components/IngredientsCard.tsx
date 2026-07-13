import { useState } from 'react'
import { normalizeTag } from '../data/allergenCatalog'
import type { AllergyProfile, Product } from '../types/product'

// parole da evidenziare nel testo ingredienti per ciascun tag del catalogo
const HIGHLIGHT_WORDS: Record<string, string[]> = {
  gluten: ['glutine', 'grano', 'frumento', 'orzo', 'segale', 'avena', 'farro', 'kamut', 'gluten', 'wheat', 'barley', 'rye', 'oat'],
  crustaceans: ['crostacei', 'gambero', 'gamberi', 'granchio', 'aragosta', 'scampi', 'crustaceans', 'shrimp', 'crab', 'lobster'],
  eggs: ['uova', 'uovo', 'albume', 'tuorlo', 'egg', 'eggs'],
  fish: ['pesce', 'acciughe', 'acciuga', 'tonno', 'salmone', 'merluzzo', 'fish', 'anchovy', 'tuna', 'salmon', 'cod'],
  peanuts: ['arachidi', 'arachide', 'peanut', 'peanuts'],
  soybeans: ['soia', 'soy', 'soja'],
  milk: ['latte', 'lattosio', 'panna', 'burro', 'siero di latte', 'formaggio', 'caseina', 'milk', 'lactose', 'cream', 'butter', 'whey', 'cheese', 'casein'],
  nuts: ['nocciole', 'nocciola', 'mandorle', 'mandorla', 'noci', 'noce', 'pistacchi', 'pistacchio', 'anacardi', 'anacardo', 'frutta a guscio', 'hazelnut', 'almond', 'walnut', 'pistachio', 'cashew', 'nuts'],
  celery: ['sedano', 'celery'],
  mustard: ['senape', 'mustard'],
  'sesame-seeds': ['sesamo', 'sesame'],
  'sulphur-dioxide-and-sulphites': ['solfiti', 'solfito', 'anidride solforosa', 'sulphites', 'sulfites', 'sulphur dioxide'],
  lupin: ['lupini', 'lupino', 'lupin'],
  molluscs: ['molluschi', 'mollusco', 'vongole', 'cozze', 'seppia', 'calamaro', 'polpo', 'molluscs', 'clam', 'mussel', 'squid', 'octopus'],
}

const ANALYSIS_BADGES: { tag: string; label: string; emoji: string }[] = [
  { tag: 'vegan', label: 'Vegano', emoji: '🌱' },
  { tag: 'non-vegan', label: 'Non vegano', emoji: '🥩' },
  { tag: 'vegetarian', label: 'Vegetariano', emoji: '🥚' },
  { tag: 'non-vegetarian', label: 'Non vegetariano', emoji: '🍖' },
  { tag: 'palm-oil-free', label: 'Senza olio di palma', emoji: '🌴' },
  { tag: 'palm-oil', label: 'Con olio di palma', emoji: '🌴' },
]

interface Props {
  product: Product
  profile: AllergyProfile | null
}

export default function IngredientsCard({ product, profile }: Props) {
  const [expanded, setExpanded] = useState(false)
  const text = product.ingredients_text_it?.trim() || product.ingredients_text?.trim()

  const additives = (product.additives_tags ?? []).map((t) =>
    normalizeTag(t).toUpperCase(),
  )
  const analysisTags = new Set(
    (product.ingredients_analysis_tags ?? []).map(normalizeTag),
  )
  const badges = ANALYSIS_BADGES.filter((b) => analysisTags.has(b.tag))

  if (!text && additives.length === 0 && badges.length === 0) return null

  const isLong = (text?.length ?? 0) > 220

  return (
    <section className="card p-4">
      <h2 className="mb-3 text-sm font-semibold text-ink-dim">Ingredienti</h2>

      {text ? (
        <>
          <p
            className={`text-sm leading-relaxed text-ink ${
              isLong && !expanded ? 'line-clamp-4' : ''
            }`}
          >
            {highlightAllergens(text, profile)}
          </p>
          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="mt-2 text-xs font-medium text-accent"
            >
              {expanded ? 'Mostra meno' : 'Mostra tutto'}
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-ink-dim">
          Elenco ingredienti non disponibile per questo prodotto.
        </p>
      )}

      {badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b.tag}
              className="rounded-full border border-edge bg-surface-2 px-3 py-1 text-xs text-ink-dim"
            >
              {b.emoji} {b.label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-edge pt-3">
        <h3 className="mb-2 text-xs font-semibold text-ink-dim">Additivi</h3>
        {additives.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {additives.map((a) => (
              <span
                key={a}
                className="rounded-md border border-edge bg-surface-2 px-2 py-0.5 font-mono text-xs text-ink-dim"
              >
                {a}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink-dim">Nessun additivo segnalato.</p>
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
    .flatMap((tag) => HIGHLIGHT_WORDS[tag] ?? [])
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
