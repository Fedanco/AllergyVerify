import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getProductByBarcode } from '../api/openFoodFacts'
import AllergyBanner from '../components/AllergyBanner'
import { BackIcon } from '../components/Icons'
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

const NUTRIMENT_ROWS: {
  key: keyof Nutriments
  labelKey: keyof Translations['productDetail']['nutriments']
  emoji: string
  unit: string
  /** chiave in nutrient_levels, se OFF fornisce il livello per questo valore */
  levelKey?: keyof NutrientLevels
}[] = [
  { key: 'energy-kcal_100g', labelKey: 'energy', emoji: '⚡', unit: 'kcal' },
  { key: 'carbohydrates_100g', labelKey: 'carbohydrates', emoji: '🍞', unit: 'g' },
  { key: 'sugars_100g', labelKey: 'sugars', emoji: '🍬', unit: 'g', levelKey: 'sugars' },
  { key: 'fat_100g', labelKey: 'fat', emoji: '🧈', unit: 'g', levelKey: 'fat' },
  { key: 'saturated-fat_100g', labelKey: 'saturatedFat', emoji: '🥓', unit: 'g', levelKey: 'saturated-fat' },
  { key: 'proteins_100g', labelKey: 'proteins', emoji: '💪', unit: 'g' },
  { key: 'fiber_100g', labelKey: 'fiber', emoji: '🌿', unit: 'g' },
  { key: 'salt_100g', labelKey: 'salt', emoji: '🧂', unit: 'g', levelKey: 'salt' },
  { key: 'sodium_100g', labelKey: 'sodium', emoji: '⚗️', unit: 'g' },
]

const LEVEL_DOTS: Record<'low' | 'moderate' | 'high', string> = {
  low: 'bg-accent',
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
        <div className="card px-5 py-6 text-center">
          <p aria-hidden className="text-3xl">🤷</p>
          <p className="mt-2 text-sm text-ink-dim">{t.productDetail.errors[errorKind]}</p>
          <p className="mt-1 font-mono text-xs text-ink-dim/60">{code}</p>
        </div>
      )}

      {!product && !errorKind && (
        <div className="card px-5 py-10 text-center text-sm text-ink-dim">
          {t.productDetail.loading}
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
                <div aria-hidden className="flex h-full w-full items-center justify-center text-3xl">🍎</div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight">
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

          <ScoreStrip product={product} />

          <AllergyBanner
            allergensTags={product.allergens_tags}
            tracesTags={product.traces_tags}
            profile={activeProfile}
          />

          <ProfilesVerdict product={product} />

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

          <IngredientsCard product={product} profile={activeProfile} />
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
        {rows.map(({ key, labelKey, emoji, unit, levelKey }) => {
          const level = levelKey ? levels?.[levelKey] : undefined
          return (
            <li key={key} className="flex items-center justify-between py-2.5">
              <span className="flex items-center gap-2.5 text-sm">
                <span aria-hidden>{emoji}</span> {t.productDetail.nutriments[labelKey]}
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
