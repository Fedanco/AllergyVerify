import { useState } from 'react'
import { ChevronDownIcon } from './Icons'
import type { Product } from '../types/product'

/**
 * Striscia di chip punteggio: Nutri-Score (A-E), NOVA (1-4, grado di
 * trasformazione), Green-Score (A-F, impatto ambientale).
 * Design proprio: lettera mono grande colorata su card scura, niente loghi OFF.
 * Toccando un chip si apre sotto un pannello con la scala e la spiegazione.
 */

interface ScoreData {
  name: string
  value: string
  hint: string
  scale: string[]
  /** indice del valore corrente nella scala */
  index: number
  /** cosa misura questo punteggio */
  about: string
  /** significato del valore corrente */
  meaning: string
}

const NUTRI_MEANINGS: Record<string, string> = {
  a: 'Qualità nutrizionale ottima.',
  b: 'Qualità nutrizionale buona.',
  c: 'Qualità nutrizionale nella media.',
  d: 'Qualità nutrizionale scarsa.',
  e: 'Qualità nutrizionale molto scarsa.',
}

const NOVA_MEANINGS: Record<string, string> = {
  1: 'Alimento non trasformato o minimamente trasformato (es. frutta, latte, legumi).',
  2: 'Ingrediente culinario trasformato (es. olio, burro, zucchero, sale).',
  3: 'Alimento trasformato (es. pane, formaggi, verdure in scatola).',
  4: 'Alimento ultra-trasformato: contiene ingredienti o processi industriali (emulsionanti, aromi, coloranti…).',
}

const GREEN_MEANINGS: Record<string, string> = {
  a: 'Impatto ambientale molto basso.',
  b: 'Impatto ambientale basso.',
  c: 'Impatto ambientale moderato.',
  d: 'Impatto ambientale alto.',
  e: 'Impatto ambientale molto alto.',
  f: 'Impatto ambientale altissimo.',
}

export default function ScoreStrip({ product }: { product: Product }) {
  const [open, setOpen] = useState<string | null>(null)
  const green = product.environmental_score_grade ?? product.ecoscore_grade

  const scores = [
    gradeScore(
      'Nutri-Score',
      product.nutriscore_grade,
      'abcde',
      'Qualità nutrizionale',
      'Riassume la qualità nutrizionale per 100 g: penalizza calorie, zuccheri, grassi saturi e sale, premia fibre e proteine. A = migliore, E = peggiore.',
      NUTRI_MEANINGS,
    ),
    novaScore(product.nova_group),
    gradeScore(
      'Green-Score',
      green,
      'abcdef',
      'Impatto ambientale',
      "Stima l'impatto ambientale del prodotto sull'intero ciclo di vita: produzione, trasporto e imballaggio. A = impatto minimo, F = massimo.",
      GREEN_MEANINGS,
    ),
  ].filter((s): s is ScoreData => s !== null)

  if (scores.length === 0) return null

  const openScore = scores.find((s) => s.name === open)

  return (
    <div className="flex flex-col gap-3">
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${scores.length}, minmax(0, 1fr))` }}
      >
        {scores.map((s) => {
          const isOpen = s.name === open
          return (
            <button
              key={s.name}
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : s.name)}
              className={`card flex flex-col items-center gap-1.5 px-2 py-3 text-center transition-colors ${
                isOpen ? 'border-accent/40' : ''
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl border font-mono text-xl font-bold ${colorFor(
                  s.index / (s.scale.length - 1),
                )}`}
              >
                {s.value}
              </span>
              <span className="text-xs font-semibold">{s.name}</span>
              <span className="text-[0.65rem] leading-tight text-ink-dim">{s.hint}</span>
              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                  isOpen
                    ? 'rotate-180 border-accent/40 bg-accent/10 text-accent'
                    : 'border-edge bg-surface-2 text-ink-dim'
                }`}
              >
                <ChevronDownIcon className="h-3.5 w-3.5" />
              </span>
            </button>
          )
        })}
      </div>

      {openScore && <ScorePanel score={openScore} />}
    </div>
  )
}

function ScorePanel({ score }: { score: ScoreData }) {
  return (
    <section className="card animate-fade-up p-4">
      <h3 className="text-sm font-semibold">
        {score.name} <span className="font-normal text-ink-dim">— {score.hint}</span>
      </h3>

      <div className="mt-3 flex items-center gap-1.5">
        {score.scale.map((step, i) => {
          const current = i === score.index
          return (
            <span
              key={step}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-sm font-bold ${
                current
                  ? colorFor(i / (score.scale.length - 1))
                  : 'border-edge bg-surface-2 text-ink-dim/50'
              }`}
            >
              {step.toUpperCase()}
            </span>
          )
        })}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink">{score.meaning}</p>
      <p className="mt-2 text-xs leading-relaxed text-ink-dim">{score.about}</p>
      <p className="mt-2 text-[0.65rem] text-ink-dim/70">
        Dati calcolati da Open Food Facts.
      </p>
    </section>
  )
}

// posizione nella scala -> colore (0 = migliore, 1 = peggiore)
function colorFor(ratio: number): string {
  if (ratio <= 0.25) return 'text-accent border-accent/40 bg-accent/10'
  if (ratio <= 0.5) return 'text-lime-400 border-lime-400/40 bg-lime-400/10'
  if (ratio <= 0.75) return 'text-warn border-warn/40 bg-warn/10'
  return 'text-danger border-danger/40 bg-danger/10'
}

function gradeScore(
  name: string,
  grade: string | undefined,
  scale: string,
  hint: string,
  about: string,
  meanings: Record<string, string>,
): ScoreData | null {
  const g = grade?.toLowerCase()
  if (!g || !scale.includes(g)) return null // es. "unknown", "not-applicable"
  return {
    name,
    value: g.toUpperCase(),
    hint,
    scale: scale.split(''),
    index: scale.indexOf(g),
    about,
    meaning: meanings[g],
  }
}

function novaScore(group: number | undefined): ScoreData | null {
  if (!group || group < 1 || group > 4) return null
  return {
    name: 'NOVA',
    value: String(group),
    hint: 'Grado di trasformazione',
    scale: ['1', '2', '3', '4'],
    index: group - 1,
    about:
      "Indica quanto un alimento è lavorato industrialmente, non quanto è sano. 1 = non trasformato, 4 = ultra-trasformato.",
    meaning: NOVA_MEANINGS[group],
  }
}
