import type { StampTone } from '../paper/Stamp'

/**
 * Tono semantico condiviso per il verdetto allergeni (AllergyBanner):
 * timbro, tinta della carta e pallino in un posto solo, così le facce del
 * verdetto (cartellino singolo, righe multi-profilo, riga di sintesi) non
 * possono disallinearsi sui colori.
 *
 * Sulla carta il colore sta nel TIMBRO, non nel testo: rosso e verde come
 * colore di testo reggono 4,5:1 solo sul crema chiaro, non sulle tinte.
 * Il testo dentro le tessere resta ink/ink-soft.
 */
export type Tone = 'danger' | 'warn' | 'safe' | 'neutral'

/** Timbro del verdetto: il neutro non ha timbro (non è un verdetto). */
export const TONE_STAMP: Partial<Record<Tone, StampTone>> = {
  danger: 'red',
  warn: 'wheat',
  safe: 'green',
}

/** Tinta della carta del cartellino/tessera (valore CSS per `--torn-bg` o `background`). */
export const TONE_TINT: Record<Tone, string> = {
  danger: 'var(--color-red-tint)',
  warn: 'var(--color-wheat-tint)',
  safe: 'var(--color-green-tint)',
  neutral: 'var(--color-sheet)',
}

/** Pallino della riga di sintesi multi-profilo: porta il tono del caso
 *  peggiore dove il testo è troppo piccolo per farlo da solo. */
export const TONE_DOT: Record<Tone, string> = {
  danger: 'bg-red',
  warn: 'bg-wheat',
  safe: 'bg-green',
  neutral: 'bg-ink-soft',
}
