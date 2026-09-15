import { useState } from 'react'
import { ChevronDownIcon } from './Icons'
import { useLang } from '../i18n/useLang'
import type { Product } from '../types/product'

/**
 * Striscia di chip punteggio: Nutri-Score (A-E), NOVA (1-4, grado di
 * trasformazione), Green-Score (A-F, impatto ambientale).
 * Design proprio: lettera grande su timbro colorato, niente loghi OFF.
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

export default function ScoreStrip({ product }: { product: Product }) {
  const { t } = useLang()
  const [open, setOpen] = useState<string | null>(null)
  const green = product.environmental_score_grade ?? product.ecoscore_grade

  const scores = [
    gradeScore(
      'Nutri-Score',
      product.nutriscore_grade,
      'abcde',
      t.scores.nutriHint,
      t.scores.nutriAbout,
      t.scores.nutriMeanings,
    ),
    novaScore(
      product.nova_group,
      t.scores.novaHint,
      t.scores.novaAbout,
      t.scores.novaMeanings,
    ),
    gradeScore(
      'Green-Score',
      green,
      'abcdef',
      t.scores.greenHint,
      t.scores.greenAbout,
      t.scores.greenMeanings,
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
          const ratio = s.index / (s.scale.length - 1)
          return (
            <button
              key={s.name}
              type="button"
              aria-expanded={isOpen}
              aria-controls={`score-panel-${s.name}`}
              onClick={() => setOpen(isOpen ? null : s.name)}
              className={`focus-ring flex flex-col items-center gap-1.5 px-2 py-3 text-center transition-colors ${
                isOpen ? 'panel border-blue' : 'card'
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] text-lg font-bold ${BADGE_CLASS[toneFor(ratio)]}`}
              >
                {s.value}
              </span>
              <span className="text-xs font-bold">{s.name}</span>
              <span className="text-[0.65rem] leading-tight text-ink-soft">{s.hint}</span>
              {/* mt-auto: freccia ancorata al fondo della card, così i tre chip
                  restano allineati anche se un sottotitolo va su due righe */}
              <span
                aria-hidden
                className={`mt-auto flex h-5 w-5 items-center justify-center rounded-full transition-[transform,background-color,color] duration-[var(--duration-fast)] ${
                  isOpen
                    ? 'rotate-180 bg-blue text-white'
                    : 'bg-sheet text-ink-soft'
                }`}
              >
                <ChevronDownIcon className="h-3.5 w-3.5" />
              </span>
            </button>
          )
        })}
      </div>

      {openScore && <ScorePanel score={openScore} dataBy={t.scores.dataBy} />}
    </div>
  )
}

function ScorePanel({ score, dataBy }: { score: ScoreData; dataBy: string }) {
  return (
    <section id={`score-panel-${score.name}`} className="panel animate-fade-up p-4">
      <h3 className="text-sm font-bold">
        {score.name} <span className="font-normal text-ink-soft">— {score.hint}</span>
      </h3>

      <div className="mt-3 flex items-center gap-1.5">
        {score.scale.map((step, i) => {
          const current = i === score.index
          return (
            <span
              key={step}
              style={{ '--i': i } as React.CSSProperties}
              className={`animate-step-in flex h-8 w-8 items-center justify-center rounded-[4px] text-sm font-bold [animation-delay:calc(var(--i)*25ms)] ${
                current
                  ? BADGE_CLASS[toneFor(i / (score.scale.length - 1))]
                  : 'bg-paper-2 text-ink-soft'
              }`}
            >
              {step.toUpperCase()}
            </span>
          )
        })}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink">{score.meaning}</p>
      <p className="mt-2 text-xs leading-relaxed text-ink-soft">{score.about}</p>
      <p className="mt-2 text-[0.65rem] text-ink-soft">{dataBy}</p>
    </section>
  )
}

// posizione nella scala -> tono (0 = migliore, 1 = peggiore)
type ScoreTone = 'safe' | 'caution' | 'warn' | 'danger'

function toneFor(ratio: number): ScoreTone {
  if (ratio <= 0.25) return 'safe'
  if (ratio <= 0.5) return 'caution'
  if (ratio <= 0.75) return 'warn'
  return 'danger'
}

// Lettere come timbri pieni con testo bianco, non tinte: rosso e verde come
// testo su una tinta chiara scendono sotto 4,5:1.
const BADGE_CLASS: Record<ScoreTone, string> = {
  safe: 'bg-green text-white',
  caution: 'bg-caution text-white',
  warn: 'bg-warn text-white',
  danger: 'bg-red text-white',
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

function novaScore(
  group: number | undefined,
  hint: string,
  about: string,
  meanings: Record<string, string>,
): ScoreData | null {
  if (!group || group < 1 || group > 4) return null
  return {
    name: 'NOVA',
    value: String(group),
    hint,
    scale: ['1', '2', '3', '4'],
    index: group - 1,
    about,
    meaning: meanings[group],
  }
}
