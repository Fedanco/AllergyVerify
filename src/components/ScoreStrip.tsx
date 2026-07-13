import type { Product } from '../types/product'

/**
 * Striscia di chip punteggio: Nutri-Score (A-E), NOVA (1-4, grado di
 * trasformazione), Green-Score (A-F, impatto ambientale).
 * Design proprio: lettera mono grande colorata su card scura, niente loghi OFF.
 */
export default function ScoreStrip({ product }: { product: Product }) {
  const green = product.environmental_score_grade ?? product.ecoscore_grade

  const chips = [
    gradeChip('Nutri-Score', product.nutriscore_grade, 'abcde', 'Qualità nutrizionale'),
    novaChip(product.nova_group),
    gradeChip('Green-Score', green, 'abcdef', 'Impatto ambientale'),
  ].filter((c) => c !== null)

  if (chips.length === 0) return null

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${chips.length}, minmax(0, 1fr))` }}
    >
      {chips}
    </div>
  )
}

// posizione nella scala -> colore (0 = migliore, 1 = peggiore)
function colorFor(ratio: number): string {
  if (ratio <= 0.25) return 'text-accent border-accent/40 bg-accent/10'
  if (ratio <= 0.5) return 'text-lime-400 border-lime-400/40 bg-lime-400/10'
  if (ratio <= 0.75) return 'text-warn border-warn/40 bg-warn/10'
  return 'text-danger border-danger/40 bg-danger/10'
}

function gradeChip(
  name: string,
  grade: string | undefined,
  scale: string,
  hint: string,
) {
  const g = grade?.toLowerCase()
  if (!g || !scale.includes(g)) return null // es. "unknown", "not-applicable"
  const ratio = scale.indexOf(g) / (scale.length - 1)
  return <Chip key={name} name={name} value={g.toUpperCase()} hint={hint} color={colorFor(ratio)} />
}

function novaChip(group: number | undefined) {
  if (!group || group < 1 || group > 4) return null
  return (
    <Chip
      key="NOVA"
      name="NOVA"
      value={String(group)}
      hint="Grado di trasformazione"
      color={colorFor((group - 1) / 3)}
    />
  )
}

function Chip({
  name,
  value,
  hint,
  color,
}: {
  name: string
  value: string
  hint: string
  color: string
}) {
  return (
    <div className="card flex flex-col items-center gap-1.5 px-2 py-3 text-center">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl border font-mono text-xl font-bold ${color}`}
      >
        {value}
      </span>
      <span className="text-xs font-semibold">{name}</span>
      <span className="text-[0.65rem] leading-tight text-ink-dim">{hint}</span>
    </div>
  )
}
