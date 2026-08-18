import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getProductByBarcode } from '../api/openFoodFacts'
import AllergyBanner from '../components/AllergyBanner'
import { BackIcon, NotFoundIcon, PackageIcon } from '../components/Icons'
import IngredientsCard from '../components/IngredientsCard'
import ProfilesVerdict from '../components/ProfilesVerdict'
import ScoreStrip from '../components/ScoreStrip'
import { useAllergyProfile } from '../hooks/useAllergyProfile'
import { useScanHistory } from '../hooks/useScanHistory'
import { useLang } from '../i18n/useLang'
import type { Translations } from '../i18n/translations'
import {
  LookupError,
  type LookupErrorKind,
  type NutrientLevels,
  type Nutriments,
  type Product,
} from '../types/product'

// Niente emoji per riga: nove pittogrammi in colonna su una tabella di numeri
// sono rumore (un panetto di burro per "Grassi" si decodifica peggio della
// parola stessa), si disegnano diversi su ogni sistema operativo, e rubavano
// l'occhio all'unico segnale che porta davvero informazione: il pallino di
// livello accanto al valore.
const NUTRIMENT_ROWS: {
  key: keyof Nutriments
  labelKey: keyof Translations['productDetail']['nutriments']
  unit: string
  /** chiave in nutrient_levels, se OFF fornisce il livello per questo valore */
  levelKey?: keyof NutrientLevels
}[] = [
  { key: 'energy-kcal_100g', labelKey: 'energy', unit: 'kcal' },
  { key: 'carbohydrates_100g', labelKey: 'carbohydrates', unit: 'g' },
  { key: 'sugars_100g', labelKey: 'sugars', unit: 'g', levelKey: 'sugars' },
  { key: 'fat_100g', labelKey: 'fat', unit: 'g', levelKey: 'fat' },
  { key: 'saturated-fat_100g', labelKey: 'saturatedFat', unit: 'g', levelKey: 'saturated-fat' },
  { key: 'proteins_100g', labelKey: 'proteins', unit: 'g' },
  { key: 'fiber_100g', labelKey: 'fiber', unit: 'g' },
  { key: 'salt_100g', labelKey: 'salt', unit: 'g', levelKey: 'salt' },
  { key: 'sodium_100g', labelKey: 'sodium', unit: 'g' },
]

const LEVEL_DOTS: Record<'low' | 'moderate' | 'high', string> = {
  low: 'bg-safe',
  moderate: 'bg-warn',
  high: 'bg-danger',
}

export default function ProductDetailPage() {
  const { code } = useParams<{ code: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { activeProfile } = useAllergyProfile()
  const { addEntry } = useScanHistory()
  const { t } = useLang()
  const [product, setProduct] = useState<Product | null>(null)
  const [errorKind, setErrorKind] = useState<LookupErrorKind | null>(null)
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
        setErrorKind(err instanceof LookupError ? err.kind : 'error')
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
        className="focus-ring mb-4 flex items-center gap-1 rounded text-sm text-ink-dim transition-colors hover:text-ink"
      >
        <BackIcon className="h-4 w-4" /> {t.productDetail.back}
      </button>

      {errorKind && (
        <div className="card flex flex-col items-center px-5 py-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-ink-dim">
            <NotFoundIcon className="h-6 w-6" />
          </span>
          <p className="mt-3 text-sm text-ink-dim">{t.productDetail.errors[errorKind]}</p>
          <p className="mt-1 font-mono text-xs text-ink-dim/60">{code}</p>
        </div>
      )}

      {!product && !errorKind && (
        <div className="card px-5 py-10 text-center text-sm text-ink-dim">
          {t.productDetail.loading}
        </div>
      )}

      {product && (
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="card flex items-center gap-3.5 p-3.5 sm:gap-4 sm:p-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:h-24 sm:w-24">
              {product.image_front_url ? (
                <img
                  src={product.image_front_url}
                  alt={product.product_name ?? ''}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-ink-dim">
                  <PackageIcon className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-lg font-bold leading-tight">
                {product.product_name ?? t.common.unnamedProduct}
              </h1>
              {product.brands && (
                <p className="mt-0.5 text-sm text-ink-dim">{product.brands}</p>
              )}
              {product.quantity && (
                <p className="mt-0.5 text-xs text-ink-dim">{product.quantity}</p>
              )}
              <p className="mt-1 font-mono text-xs text-ink-dim/60">{product.code}</p>
            </div>
          </div>

          {/* L'ordine segue la domanda di chi apre la pagina: "posso
              mangiarlo?" prima di tutto, poi "perche'?" (gli ingredienti, che
              sono la prova del verdetto), e solo dopo il resto. Prima i
              punteggi nutrizionali stavano sopra al verdetto, cioe' l'app
              rispondeva a una domanda che nessuno le aveva fatto. */}
          <AllergyBanner product={product} profile={activeProfile} />

          <ProfilesVerdict product={product} />

          <IngredientsCard product={product} profile={activeProfile} />

          <ScoreStrip product={product} />

          <section className="card p-4">
            <h2 className="mb-3 text-sm font-semibold text-ink-dim">
              {t.productDetail.nutrimentsTitle}{' '}
              <span className="font-normal">{t.productDetail.per100g}</span>
            </h2>
            <NutrimentTable
              nutriments={product.nutriments}
              levels={product.nutrient_levels}
            />
          </section>
        </div>
      )}
    </div>
  )
}

function NutrimentTable({
  nutriments,
  levels,
}: {
  nutriments?: Nutriments
  levels?: NutrientLevels
}) {
  const { t } = useLang()
  const rows = NUTRIMENT_ROWS.filter((r) => typeof nutriments?.[r.key] === 'number')

  if (rows.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-ink-dim">
        {t.productDetail.nutrimentsUnavailable}
      </p>
    )
  }

  const hasLevels = rows.some((r) => r.levelKey && levels?.[r.levelKey])

  return (
    <>
      <ul className="divide-y divide-edge">
        {rows.map(({ key, labelKey, unit, levelKey }) => {
          const level = levelKey ? levels?.[levelKey] : undefined
          return (
            <li key={key} className="flex items-center justify-between py-2.5">
              <span className="flex items-center gap-2 text-sm">
                {t.productDetail.nutriments[labelKey]}
                {level && (
                  <span
                    title={t.productDetail.levelTitle(t.productDetail.levels[level])}
                    className={`h-2 w-2 rounded-full ${LEVEL_DOTS[level]}`}
                  />
                )}
              </span>
              <span className="font-mono text-sm font-medium">
                {formatValue(nutriments![key]!)} {unit}
              </span>
            </li>
          )
        })}
      </ul>
      {hasLevels && (
        <div className="mt-3 border-t border-edge pt-3 text-[0.65rem] leading-relaxed text-ink-dim">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {(Object.keys(LEVEL_DOTS) as (keyof typeof LEVEL_DOTS)[]).map((l) => (
              <span key={l} className="flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${LEVEL_DOTS[l]}`} />
                {t.productDetail.levels[l]}
              </span>
            ))}
          </p>
          <p className="mt-1 opacity-80">{t.productDetail.levelLegend}</p>
        </div>
      )}
    </>
  )
}

function formatValue(v: number): string {
  return v % 1 === 0 ? String(v) : v.toFixed(1)
}
