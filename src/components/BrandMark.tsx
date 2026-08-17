interface BrandMarkProps {
  className?: string
}

// stesso stile a tratto delle icone in Icons.tsx (duplicato qui per non rompere
// la convenzione "un file → solo componenti" richiesta dal Fast Refresh)
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/**
 * Marchio piatto per l'interno dell'app (sidebar, Impostazioni, modale installa):
 * spiga di grano + lente d'ingrandimento + segnale d'allerta, nello stesso
 * linguaggio a tratto delle icone in Icons.tsx — coerente sulle superfici scure,
 * a differenza della versione glossy con sfondo bianco usata per favicon/Home screen
 * (public/logo.png e derivati), pensata per quel contesto diverso.
 */
export default function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      {/* stelo */}
      <path d="M12 20V11" />
      {/* chicco di grano */}
      <path d="M12 4c2.2 2 2.2 5 0 7-2.2-2-2.2-5 0-7Z" />
      {/* foglie alla base */}
      <path d="M12 20c-1.8 0-3.2-1-3.8-2.6M12 20c1.8 0 3.2-1 3.8-2.6" />
      {/* lente d'ingrandimento sul chicco */}
      <circle cx="12" cy="7.5" r="4.2" />
      <path d="m15.4 10.4 3.6 3.6" />
      {/* badge di allerta */}
      <circle cx="6.3" cy="18.7" r="2.3" />
      <path d="M6.3 17.6v1.1M6.3 19.9h.01" />
    </svg>
  )
}
