import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'
import PageHeader from '../components/PageHeader'

type ScanState = 'starting' | 'scanning' | 'denied' | 'unavailable'

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<ScanState>('starting')
  const navigate = useNavigate()

  useEffect(() => {
    let controls: IScannerControls | undefined
    let cancelled = false
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
              navigate(`/product/${result.getText()}`, { state: { fromScan: true } })
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
      controls?.stop()
    }
  }, [navigate])

  return (
    <div>
      <PageHeader
        title="Scansiona"
        subtitle="Inquadra il codice a barre del prodotto"
      />

      <div className="card relative aspect-[3/4] overflow-hidden md:aspect-video">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
        />

        {state === 'scanning' && (
          <>
            {/* cornice di mira */}
            <div className="pointer-events-none absolute inset-x-8 inset-y-16 rounded-2xl border-2 border-accent/60" />
            {/* linea di scansione animata */}
            <div className="pointer-events-none absolute inset-x-10 h-0.5 animate-scanline bg-accent shadow-[0_0_12px_var(--color-accent)]" />
          </>
        )}

        {state === 'starting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface">
            <p className="text-sm text-ink-dim">Avvio fotocamera…</p>
          </div>
        )}

        {(state === 'denied' || state === 'unavailable') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface px-6 text-center">
            <p className="text-3xl">📷</p>
            <p className="text-sm text-ink-dim">
              {state === 'denied'
                ? 'Accesso alla fotocamera negato. Consenti l’uso della fotocamera nelle impostazioni del browser e ricarica la pagina.'
                : 'Fotocamera non disponibile su questo dispositivo. Usa la ricerca manuale.'}
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-ink-dim">
        Il codice viene riconosciuto automaticamente: nessuno scatto necessario.
      </p>
    </div>
  )
}
