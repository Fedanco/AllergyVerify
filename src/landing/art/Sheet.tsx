import { useMemo, type CSSProperties, type ReactNode } from 'react'
import { sheetClip } from './tornClip'

interface SheetProps {
  id?: string
  seed: number
  className?: string
  children: ReactNode
}

/**
 * Cartoncino a tutta larghezza incollato sopra la pagina, con lo strappo in
 * alto e in basso: è il modo in cui le sezioni si separano (variante scelta
 * da Fede tra quattro prove). Una sezione sì e una no sta sul cartoncino,
 * così la pagina si legge come una pila di fogli anche scorrendo in fretta.
 * Il padding verticale è più alto delle altre sezioni per fare posto allo
 * strappo, che mangia ~14px per lato.
 */
export default function Sheet({ id, seed, className = '', children }: SheetProps) {
  const clip = useMemo(() => sheetClip(seed), [seed])
  return (
    <section
      id={id}
      className={`sheet scroll-mt-4 py-20 md:py-28 ${className}`}
      style={{ '--sheet-clip': clip } as CSSProperties}
    >
      {children}
    </section>
  )
}
