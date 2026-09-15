import type { CSSProperties, ReactNode } from 'react'

export type StampTone = 'blue' | 'red' | 'green' | 'wheat'

const TONE_CLASS: Record<StampTone, string> = {
  blue: 'bg-blue text-white',
  red: 'bg-red text-white',
  green: 'bg-green text-white',
  // Il grano è chiaro: sopra ci va inchiostro, non bianco.
  wheat: 'bg-wheat text-ink',
}

interface StampProps {
  tone: StampTone
  /** Inclinazione in gradi; ogni timbro storto un po' diversamente. */
  tilt?: number
  className?: string
  children: ReactNode
}

/** Timbro colorato: testo mono maiuscolo su fondo pieno, bordo irregolare. */
export default function Stamp({ tone, tilt = -1.5, className = '', children }: StampProps) {
  return (
    <span
      className={`stamp ${TONE_CLASS[tone]} ${className}`}
      style={{ '--stamp-tilt': `${tilt}deg` } as CSSProperties}
    >
      {children}
    </span>
  )
}
