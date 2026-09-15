import { useMemo, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { tornClip } from './tornClip'

interface TornProps {
  as?: ElementType
  seed?: number
  /** Ampiezza massima dello strappo in px. */
  amp?: number
  /** Denti per lato. */
  teeth?: number
  /** Colore di fondo del cartellino (default: carta chiara). */
  bg?: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
  [prop: string]: unknown
}

/**
 * Cartellino di carta strappata. Il fondo e il ritaglio stanno su `::before`
 * (utility `torn` in landing.css), l'ombra segue lo strappo perché è un
 * `drop-shadow` sull'elemento intero.
 */
export default function Torn({
  as: Tag = 'div',
  seed = 1,
  amp,
  teeth,
  bg,
  className = '',
  style,
  children,
  ...rest
}: TornProps) {
  const clip = useMemo(() => tornClip(seed, amp, teeth), [seed, amp, teeth])
  const vars = {
    '--torn-clip': clip,
    ...(bg ? { '--torn-bg': bg } : {}),
    ...style,
  } as CSSProperties
  return (
    <Tag className={`torn ${className}`} style={vars} {...rest}>
      {children}
    </Tag>
  )
}
