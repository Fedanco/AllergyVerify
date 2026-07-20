import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'
import { Link } from 'react-router-dom'
import { CheckIcon } from '../components/Icons'
import PageHeader from '../components/PageHeader'
import { useLang } from '../i18n/useLang'

type ScanState = 'starting' | 'scanning' | 'detected' | 'denied' | 'unavailable'

// Pausa breve sul momento "trovato" prima di navigare: dà al gesto di
// scansione un feedback soddisfacente invece di saltare via all'istante.
const DETECTED_DELAY_MS = 350

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<ScanState>('starting')
  const navigate = useNavigate()
  const { t } = useLang()

  useEffect(() => {
    let controls: IScannerControls | undefined
    let cancelled = false
    let navigateTimeout: ReturnType<typeof setTimeout> | undefined
    const reader = new BrowserMultiFormatReader()

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setState('unavailable')
        return
      }
      try {
        controls = await reader.decodeFromVideoDevice(
          undefined, // camera di default (posteriore su mobile)
          videoRef.current!,
          (result) => {
            if (result && !cancelled) {
              cancelled = true
              controls?.stop()
              setState('detected')
              navigateTimeout = setTimeout(() => {
                navigate(`/product/${result.getText()}`, { state: { fromScan: true } })
              }, DETECTED_DELAY_MS)
            }
          },
        )
        if (!cancelled) setState('scanning')
      } catch {
        if (!cancelled) setState('denied')
      }
    }

    start()
    return () => {
      cancelled = true
      clearTimeout(navigateTimeout)
      controls?.stop()
    }
  }, [navigate])

  return (
    <div>
      <PageHeader title={t.scan.title} subtitle={t.scan.subtitle} />

      <div className="card relative mx-auto aspect-[4/3] max-w-xl overflow-hidden md:aspect-video">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
        />

        {(state === 'scanning' || state === 'detected') && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* zona di mira bassa e larga, come un codice a barre; l'esterno viene oscurato.
                Al rilevamento (stato "detected"): un lieve scale-up + il glow "sicuro" già
                usato per il verdetto allergeni, per riconoscere lo stesso segnale "confermato". */}
            <div
              className={`relative h-2/5 w-3/4 max-w-sm rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] transition-transform duration-[var(--duration-base)] ${
                state === 'detected' ? 'scale-105' : ''
              }`}
            >
              {/* angoli della cornice */}
              <div className="absolute -top-px -left-px h-5 w-5 rounded-tl-xl border-t-2 border-l-2 border-accent" />
              <div className="absolute -top-px -right-px h-5 w-5 rounded-tr-xl border-t-2 border-r-2 border-accent" />
              <div className="absolute -bottom-px -left-px h-5 w-5 rounded-bl-xl border-b-2 border-l-2 border-accent" />
              <div className="absolute -bottom-px -right-px h-5 w-5 rounded-br-xl border-b-2 border-r-2 border-accent" />
              {state === 'scanning' ? (
                // linea di scansione animata
                <div className="absolute inset-x-3 h-0.5 animate-scanline bg-accent shadow-[0_0_12px_var(--color-accent)]" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="animate-icon-pop flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent shadow-glow-safe">
                    <CheckIcon className="h-8 w-8" />
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {state === 'starting' && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 flex items-center justify-center bg-surface"
          >
            <p className="text-sm text-ink-dim">{t.scan.starting}</p>
          </div>
        )}

        {(state === 'denied' || state === 'unavailable') && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface px-6 text-center"
          >
            <p aria-hidden className="text-3xl">📷</p>
            <p className="text-sm text-ink-dim">
              {state === 'denied' ? t.scan.denied : t.scan.unavailable}
            </p>
            <Link to="/" className="focus-ring rounded text-sm font-medium text-accent">
              {t.scan.searchInstead}
            </Link>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-ink-dim">{t.scan.hint}</p>
    </div>
  )
}
