import { useMemo, type CSSProperties } from 'react'

/**
 * Filtri SVG condivisi da tutti i tratti "a pastello" della pagina: un
 * displacement che increspa il bordo del tratto e un rumore che lo buca
 * come la cera sulla carta. Vanno montati una volta sola (in Landing).
 *
 * `crayon` è per i tratti grandi (raggi, scarabocchio dell'hero, icone);
 * `crayon-fine` ha lo stesso carattere ma scala minore, per le sottolineature
 * dentro il testo, dove il viewBox è piccolo e lo stesso scale sfigurerebbe.
 */
export function CrayonDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        <filter id="crayon" x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
          <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="7" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.4" result="holes" />
          <feComposite in="shape" in2="holes" operator="in" />
        </filter>
        <filter id="crayon-fine" x="-6%" y="-30%" width="112%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="turbulence" baseFrequency="0.09" numOctaves="2" seed="11" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="5" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1 1.35" result="holes" />
          <feComposite in="shape" in2="holes" operator="in" />
        </filter>
      </defs>
    </svg>
  )
}

interface ArtProps {
  className?: string
}

/**
 * Raggi rossi intorno all'adesivo dell'hero: due per lato, in alto, come
 * nel mock di riferimento. L'animazione (pop) sta sull'<svg> intero, non sui
 * singoli path filtrati: vedi il commento all'utility `reveal`.
 */
export function Rays({ className = '' }: ArtProps) {
  const rays = useMemo(() => {
    // angoli in gradi, 0 = destra, senso orario (y verso il basso)
    const angles = [204, 226, 314, 336]
    return angles.map((deg, i) => {
      const a = (deg * Math.PI) / 180
      const r1 = 74 + (i % 2) * 4
      const r2 = r1 + 22
      const x1 = 100 + r1 * Math.cos(a)
      const y1 = 100 + r1 * Math.sin(a)
      const x2 = 100 + r2 * Math.cos(a)
      const y2 = 100 + r2 * Math.sin(a)
      return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`
    })
  }, [])
  return (
    <svg
      viewBox="0 0 200 200"
      className={`animate-pop text-red [animation-delay:560ms] ${className}`}
      aria-hidden="true"
    >
      {rays.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
          filter="url(#crayon)"
        />
      ))}
    </svg>
  )
}

/**
 * Scarabocchio blu a pastello su cui poggia l'adesivo: righe orizzontali di
 * lunghezza diversa, scoperte da sinistra a destra come un tratto di
 * pennarello.
 */
export function Scribble({ className = '' }: ArtProps) {
  const strokes = useMemo(() => {
    const rows = [
      [28, 392, 6],
      [8, 376, -4],
      [40, 412, 5],
      [16, 388, -5],
      [34, 404, 4],
      [6, 366, -6],
      [46, 396, 3],
    ]
    return rows.map(([x1, x2, dy], i) => {
      const y = 16 + i * 15
      return `M${x1} ${y} L${x2} ${y + dy}`
    })
  }, [])
  return (
    <svg
      viewBox="0 0 420 130"
      preserveAspectRatio="none"
      className={`reveal text-blue ${className}`}
      style={{ '--reveal-delay': '160ms' } as CSSProperties}
      aria-hidden="true"
    >
      {strokes.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={15}
          strokeLinecap="round"
          fill="none"
          opacity={0.92}
          filter="url(#crayon)"
        />
      ))}
    </svg>
  )
}
