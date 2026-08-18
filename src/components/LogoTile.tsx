interface LogoTileProps {
  className?: string
}

/**
 * Il logo dell'app (spiga di grano + lente d'ingrandimento + badge d'allerta).
 *
 * Nessuna cornice intorno: il file è già un'icona finita, con la sua forma a
 * squircle, la sua luce e la sua ombra. Incorniciarlo in una `card` aggiungeva
 * una seconda forma che non combaciava — nella dock desktop il riquadro da
 * 40px con `--radius-card` (24px) diventava un cerchio pieno, con lo squircle
 * dentro. Su fondo scuro il tile bianco si comporta da solo, come un'icona
 * sulla Home di iOS.
 *
 * L'immagine non è quadrata (248×260): i punti di chiamata danno l'altezza e
 * lasciano libera la larghezza. `width`/`height` servono al browser per
 * riservare lo spazio giusto prima che il file arrivi, e `max-w-none`
 * neutralizza il `max-width: 100%` del reset, che dentro una riga flex stretta
 * comprimerebbe il riquadro lasciando il logo in mezzo al vuoto.
 */
export default function LogoTile({ className }: LogoTileProps) {
  return (
    <img
      src="./logo-v2.png"
      alt=""
      aria-hidden="true"
      width={248}
      height={260}
      className={`block w-auto max-w-none shrink-0 object-contain ${className ?? ''}`}
    />
  )
}
