/**
 * Icone dei tre passi, disegnate a pastello: codice a barre, tessere del
 * verdetto, riga sottolineata. Stessa dimensione (64×64) e stesso filtro.
 */

interface IconProps {
  className?: string
}

export function BarcodeIcon({ className = '' }: IconProps) {
  const bars = [
    [8, 4],
    [15, 2],
    [21, 5],
    [29, 2],
    [34, 3],
    [40, 5],
    [48, 2],
    [53, 4],
  ]
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g filter="url(#crayon)">
        {bars.map(([x, w]) => (
          <line
            key={x}
            x1={x}
            y1={14}
            x2={x}
            y2={50}
            stroke="var(--color-blue)"
            strokeWidth={w}
            strokeLinecap="round"
          />
        ))}
        {/* angoli del mirino della fotocamera, a inchiostro */}
        <path d="M4 16 V6 H14 M50 6 H60 V16 M60 48 V58 H50 M14 58 H4 V48" stroke="var(--color-ink)" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function TilesIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g filter="url(#crayon)">
        <rect x="6" y="20" width="16" height="20" rx="2" fill="var(--color-red)" transform="rotate(-4 14 30)" />
        <rect x="24" y="22" width="16" height="20" rx="2" fill="var(--color-wheat)" transform="rotate(3 32 32)" />
        <rect x="42" y="20" width="16" height="20" rx="2" fill="var(--color-green)" transform="rotate(-2 50 30)" />
        <path d="M14 9 l4 4 M32 7 v6 M50 9 l-4 4" stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function ReadIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g filter="url(#crayon)" strokeLinecap="round" fill="none">
        <path d="M8 16 H50" stroke="var(--color-ink)" strokeWidth={5} />
        <path d="M8 30 H36" stroke="var(--color-ink)" strokeWidth={5} />
        <path d="M8 44 H46" stroke="var(--color-ink)" strokeWidth={5} />
        <path d="M6 37 C 14 34, 24 40, 38 35" stroke="var(--color-red)" strokeWidth={6} />
      </g>
    </svg>
  )
}

/** Codice a barre largo per l'etichetta "Cosa c'è dentro": solo inchiostro. */
export function BarcodeWide({ className = '' }: IconProps) {
  const seq = [3, 1, 2, 1, 4, 1, 1, 2, 3, 1, 2, 2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 4, 1, 2, 1, 1, 3]
  let x = 2
  const bars = seq.map((w, i) => {
    const bar = i % 2 === 0 ? { x, w } : null
    x += w + 1
    return bar
  })
  return (
    <svg viewBox={`0 0 ${x + 2} 40`} preserveAspectRatio="none" className={className} aria-hidden="true">
      {bars.map(
        (b) =>
          b && <rect key={b.x} x={b.x} y={0} width={b.w} height={40} fill="var(--color-ink)" />,
      )}
    </svg>
  )
}
