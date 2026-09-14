import type { CSSProperties, ReactNode } from 'react'

interface UnderlineProps {
  color?: 'red' | 'wheat' | 'blue'
  /** Ritardo (ms) prima che il tratto si disegni, quando l'antenato è in vista. */
  delay?: number
  className?: string
  children: ReactNode
}

const COLOR_CLASS = {
  red: 'text-red',
  wheat: 'text-wheat',
  blue: 'text-blue',
}

/**
 * Parola sottolineata a pennarello: un tratto ondulato sotto il testo che si
 * disegna da sinistra a destra. Il verdetto dell'app fa lo stesso gesto sugli
 * ingredienti, per questo è il segno ricorrente della pagina.
 */
export default function Underline({ color = 'red', delay = 0, className = '', children }: UnderlineProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 24"
        preserveAspectRatio="none"
        className={`reveal absolute bottom-[-0.06em] left-[-2%] h-[0.3em] w-[104%] ${COLOR_CLASS[color]}`}
        style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
      >
        <path
          d="M4 14 C 40 6, 80 20, 118 11 S 170 16, 196 9"
          stroke="currentColor"
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
          filter="url(#crayon-fine)"
        />
      </svg>
    </span>
  )
}
