import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getProductByBarcode } from '../api/openFoodFacts'
import AllergyBanner from '../components/AllergyBanner'
import { BackIcon } from '../components/Icons'
import { useAllergyProfile } from '../hooks/useAllergyProfile'
import { useScanHistory } from '../hooks/useScanHistory'
import { LookupError, type Nutriments, type Product } from '../types/product'

const NUTRIMENT_ROWS: { key: keyof Nutriments; label: string; emoji: string; unit: string }[] = [
  { key: 'energy-kcal_100g', label: 'Energia', emoji: '⚡', unit: 'kcal' },
  { key: 'carbohydrates_100g', label: 'Carboidrati', emoji: '🍞', unit: 'g' },
  { key: 'sugars_100g', label: 'Zuccheri', emoji: '🍬', unit: 'g' },
  { key: 'fat_100g', label: 'Grassi', emoji: '🧈', unit: 'g' },
  { key: 'saturated-fat_100g', label: 'Grassi saturi', emoji: '🥓', unit: 'g' },
  { key: 'proteins_100g', label: 'Proteine', emoji: '💪', unit: 'g' },
  { key: 'fiber_100g', label: 'Fibre', emoji: '🌿', unit: 'g' },
  { key: 'salt_100g', label: 'Sale', emoji: '🧂', unit: 'g' },
  { key: 'sodium_100g', label: 'Sodio', emoji: '⚗️', unit: 'g' },
]

const ERROR_MESSAGES: Record<string, string> = {
  'not-found': 'Prodotto non presente nel database Open Food Facts.',
  offline: 'Sei offline: connettiti a internet e riprova.',
  timeout: 'La richiesta ha impiegato troppo tempo. Riprova.',
  error: 'Si è verificato un errore nel caricamento del prodotto.',
}

export default function ProductDetailPage() {
  const { code } = useParams<{ code: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { activeProfile } = useAllergyProfile()
  const { addEntry } = useScanHistory()
  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const savedRef = useRef(false)

  useEffect(() => {
    if (!code) return
    let cancelled = false
    getProductByBarcode(code)
      .then((p) => {
        if (cancelled) return
        setProduct(p)
        if (!savedRef.current) {
          savedRef.current = true
          const fromScan = (location.state as { fromScan?: boolean } | null)?.fromScan
          addEntry(p, fromScan ? 'scan' : 'search')
        }
      })
      .catch((err) => {
        if (cancelled) return
        const kind = err instanceof LookupError ? err.kind : 'error'
        setError(ERROR_MESSAGES[kind])
      })
    return () => {
      cancelled = true
    }
  }, [code, addEntry, location.state])

  return (
    <div className="animate-fade-up">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-ink-dim transition-colors hover:text-ink"
      >
        <BackIcon className="h-4 w-4" /> Indietro
      </button>

      {error && (
        <div className="card px-5 py-6 text-center">
          <p className="text-3xl">🤷</p>
          <p className="mt-2 text-sm text-ink-dim">{error}</p>
          <p className="mt-1 font-mono text-xs text-ink-dim/60">{code}</p>
        </div>
      )}

      {!product && !error && (
        <div className="card px-5 py-10 text-center text-sm text-ink-dim">
          Caricamento prodotto…
        </div>
      )}

      {product && (
        <div className="flex flex-col gap-4">
          <div className="card flex items-center gap-4 p-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-2">
              {product.image_front_url ? (
                <img
                  src={product.image_front_url}
                  alt={product.product_name ?? ''}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl">🍎</div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight">
                {product.product_name ?? 'Prodotto senza nome'}
              </h1>
              {product.brands && (
                <p className="mt-0.5 text-sm text-ink-dim">{product.brands}</p>
              )}
              <p className="mt-1 font-mono text-xs text-ink-dim/60">{product.code}</p>
            </div>
          </div>

          <AllergyBanner
            allergensTags={product.allergens_tags}
            profile={activeProfile}
          />

          <section className="card p-4">
            <h2 className="mb-3 text-sm font-semibold text-ink-dim">
              Valori nutrizionali <span className="font-normal">/ 100 g</span>
            </h2>
            <NutrimentTable nutriments={product.nutriments} />
          </section>
        </div>
      )}
    </div>
  )
}

function NutrimentTable({ nutriments }: { nutriments?: Nutriments }) {
  const rows = NUTRIMENT_ROWS.filter((r) => typeof nutriments?.[r.key] === 'number')

  if (rows.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-ink-dim">
        Valori nutrizionali non disponibili per questo prodotto.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-edge">
      {rows.map(({ key, label, emoji, unit }) => (
        <li key={key} className="flex items-center justify-between py-2.5">
          <span className="flex items-center gap-2.5 text-sm">
            <span aria-hidden>{emoji}</span> {label}
          </span>
          <span className="font-mono text-sm font-medium">
            {formatValue(nutriments![key]!)} {unit}
          </span>
        </li>
      ))}
    </ul>
  )
}

function formatValue(v: number): string {
  return v % 1 === 0 ? String(v) : v.toFixed(1)
}
