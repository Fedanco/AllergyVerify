import { useEffect, useState } from 'react'
import { ChevronDownIcon } from './Icons'
import { useLang } from '../i18n/useLang'
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
              onClick={() => setOpen(isOpen ? null : s.name)}
              className={`focus-ring flex flex-col items-center gap-1.5 px-2 py-3 text-center transition-colors ${
                isOpen ? 'panel border-accent/40' : 'card'
              }`}
            >
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                <ScoreRing ratio={ratio} className={RING_CLASS[toneFor(ratio)]} />
                <span
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border font-mono text-lg font-bold ${BADGE_CLASS[toneFor(ratio)]}`}
                >
                  {s.value}
                </span>
              </span>
              <span className="text-xs font-semibold">{s.name}</span>
              <span className="text-[0.65rem] leading-tight text-ink-dim">{s.hint}</span>
              {/* mt-auto: freccia ancorata al fondo della card, così i tre chip
                  restano allineati anche se un sottotitolo va su due righe */}
              <span
                aria-hidden
                className={`mt-auto flex h-5 w-5 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-[var(--duration-fast)] ${
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

      {openScore && <ScorePanel score={openScore} dataBy={t.scores.dataBy} />}
    </div>
  )
}

function ScorePanel({ score, dataBy }: { score: ScoreData; dataBy: string }) {
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
              style={{ '--i': i } as React.CSSProperties}
              className={`animate-step-in flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-sm font-bold [animation-delay:calc(var(--i)*25ms)] ${
                current
                  ? BADGE_CLASS[toneFor(i / (score.scale.length - 1))]
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
      <p className="mt-2 text-[0.65rem] text-ink-dim/70">{dataBy}</p>
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

const BADGE_CLASS: Record<ScoreTone, string> = {
  safe: 'text-accent border-accent/40 bg-accent/10',
  caution: 'text-caution border-caution/40 bg-caution/10',
  warn: 'text-warn border-warn/40 bg-warn/10',
  danger: 'text-danger border-danger/40 bg-danger/10',
}

const RING_CLASS: Record<ScoreTone, string> = {
  safe: 'text-accent',
  caution: 'text-caution',
  warn: 'text-warn',
  danger: 'text-danger',
}

/**
 * Anello che si riempie da vuoto alla posizione del punteggio nella scala
 * al primo render (momento firma). Sta dietro il badge colorato come un
 * piccolo "gauge", non lo sostituisce: la lettera resta leggibile subito.
 */
function ScoreRing({ ratio, className }: { ratio: number; className?: string }) {
  const size = 40
  const strokeWidth = 3
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const fillRatio = ratio // ratio vicino a 1 = peggiore -> anello pieno (il rischio deve saltare all'occhio)
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full -rotate-90 ${className ?? ''}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - (filled ? fillRatio : 0))}
        style={{ transition: 'stroke-dashoffset var(--duration-slow) var(--ease-out-expo)' }}
      />
    </svg>
  )
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
