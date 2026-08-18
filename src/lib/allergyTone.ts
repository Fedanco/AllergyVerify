import { AlertIcon, CheckIcon, InfoIcon } from '../components/Icons'

/**
 * Tono semantico condiviso per il verdetto allergeni: usato sia dal banner
 * principale (AllergyBanner) sia dal confronto multi-profilo
 * (ProfilesVerdict), così le due UI non possono disallinearsi.
 */
export type Tone = 'danger' | 'warn' | 'safe' | 'neutral'

type IconComponent = typeof AlertIcon

export const TONE_ICON: Record<Tone, IconComponent> = {
  danger: AlertIcon,
  warn: AlertIcon,
  safe: CheckIcon,
  neutral: InfoIcon,
}

/** Colore testo isolato, per righe compatte (es. ProfilesVerdict). */
export const TONE_TEXT: Record<Tone, string> = {
  danger: 'text-danger',
  warn: 'text-warn',
  safe: 'text-safe',
  neutral: 'text-ink-dim',
}

/**
 * Bordo + sfondo tinto + testo, per superfici tonali (pill, banner).
 * La tinta e' al 20%, non al 10%: sul fondo blu quasi nero una velatura
 * del 10% diventa un grigio appena colorato e il verdetto smette di
 * riconoscersi da lontano, che e' l'unica cosa che deve saper fare.
 */
export const TONE_SURFACE: Record<Tone, string> = {
  danger: 'border-danger/45 bg-danger/20 text-danger',
  warn: 'border-warn/45 bg-warn/20 text-warn',
  safe: 'border-safe/45 bg-safe/20 text-safe',
  neutral: 'border-edge bg-surface-2 text-ink-dim',
}

/**
 * Glow riservato al verdetto principale (AllergyBanner): solo danger/safe.
 * Mai su warn/neutral, altrimenti il glow smette di segnalare "questo è il
 * verdetto vero" e diventa decorazione generica.
 */
export const TONE_GLOW: Partial<Record<Tone, string>> = {
  danger: 'shadow-glow-danger',
  safe: 'shadow-glow-safe',
}
