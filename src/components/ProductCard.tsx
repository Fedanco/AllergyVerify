import { Link } from 'react-router-dom'
import { labelForTag, matchAllergens } from '../data/allergenCatalog'
import { useLang } from '../i18n/useLang'
import type { AllergyProfile } from '../types/product'
import { AlertIcon, ChevronRightIcon } from './Icons'

interface Props {
  code: string
  name: string
  brands?: string
  imageUrl?: string
  allergensTags?: string[]
  profile: AllergyProfile | null
  subtitle?: string
}

/** Riga/card prodotto usata nei risultati di ricerca e nello storico. */
export default function ProductCard({
  code,
  name,
  brands,
  imageUrl,
  allergensTags,
  profile,
  subtitle,
}: Props) {
  const { lang } = useLang()
  const detected = profile ? matchAllergens(allergensTags, profile.allergens) : []

  return (
    <Link
      to={`/product/${code}`}
      className="card group flex items-center gap-3 p-3 transition-[border-color,box-shadow,transform] duration-[var(--duration-fast)] hover:border-accent/40 hover:shadow-md active:scale-[0.99]"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-2">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div aria-hidden className="flex h-full w-full items-center justify-center text-lg">🍎</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{name}</p>
        {brands && <p className="truncate text-xs text-ink-dim">{brands}</p>}
        {subtitle && <p className="text-[0.65rem] text-ink-dim">{subtitle}</p>}
        {detected.length > 0 && (
          <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-danger">
            <AlertIcon className="h-3.5 w-3.5" />
            {detected.map((tag) => labelForTag(tag, lang)).join(', ')}
          </p>
        )}
      </div>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-dim transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5" />
    </Link>
  )
}
