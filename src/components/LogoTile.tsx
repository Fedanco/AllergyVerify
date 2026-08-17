interface LogoTileProps {
  className?: string
}

/**
 * Il logo di Fede (spiga di grano + lente d'ingrandimento + badge d'allerta)
 * mostrato dentro un piccolo riquadro: lo sfondo bianco dell'immagine
 * originale stonerebbe usato a piena grandezza sulle superfici scure
 * dell'app, ma incorniciato in una card è lo stesso trattamento che
 * iOS/Android riservano alle icone delle app in un contesto scuro.
 */
export default function LogoTile({ className }: LogoTileProps) {
  return (
    <span className={`card inline-flex shrink-0 items-center justify-center overflow-hidden p-1.5 ${className ?? ''}`}>
      <img src="./logo.png" alt="" className="h-full w-full rounded-lg object-cover" aria-hidden="true" />
    </span>
  )
}
