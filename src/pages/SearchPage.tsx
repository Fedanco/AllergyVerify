import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductByBarcode, searchProducts } from '../api/openFoodFacts'
import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import { SearchIcon } from '../components/Icons'
import { useAllergyProfile } from '../hooks/useAllergyProfile'
import { useLang } from '../i18n/useLang'
import { LookupError, type Product } from '../types/product'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { activeProfile } = useAllergyProfile()
  const { t } = useLang()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q || loading) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      if (/^\d{6,14}$/.test(q)) {
        // barcode esatto: vai dritto al dettaglio
        await getProductByBarcode(q)
        navigate(`/product/${q}`)
      } else {
        const products = await searchProducts(q)
        if (products.length === 0) setError(t.search.errors['not-found'])
        else setResults(products)
      }
    } catch (err) {
      const kind = err instanceof LookupError ? err.kind : 'error'
      setError(t.search.errors[kind])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title={t.search.title} subtitle={t.search.subtitle} />

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            {t.search.placeholder}
          </label>
          <SearchIcon
            aria-hidden
            className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-dim"
          />
          <input
            id="search-input"
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search.placeholder}
            className="w-full rounded-2xl border border-edge bg-surface py-3 pl-11 pr-4 text-sm outline-none transition-colors duration-[var(--duration-fast)] placeholder:text-ink-dim/60 focus:border-accent"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          aria-busy={loading}
          className="focus-ring rounded-2xl bg-accent px-5 text-sm font-semibold text-bg transition-[opacity,box-shadow,transform] duration-[var(--duration-fast)] hover:shadow-md active:scale-[0.97] disabled:opacity-40"
        >
          {loading ? '…' : t.search.submit}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="animate-fade-up rounded-2xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn"
        >
          {error}
        </p>
      )}

      {results && (
        <ul className="flex flex-col gap-2">
          {results.map((p, i) => (
            <li
              key={p.code}
              style={{ '--i': Math.min(i, 8) } as React.CSSProperties}
              className="animate-step-in [animation-delay:calc(var(--i)*40ms)]"
            >
              <ProductCard
                code={p.code}
                name={p.product_name ?? t.common.unnamedProduct}
                brands={p.brands}
                imageUrl={p.image_front_url}
                allergensTags={p.allergens_tags}
                profile={activeProfile}
              />
            </li>
          ))}
        </ul>
      )}

      {!results && !error && !loading && (
        <div className="card mt-4 px-5 py-6 text-center">
          <p aria-hidden className="text-3xl">🔍</p>
          <p className="mt-2 text-sm text-ink-dim">
            {t.search.emptyHint1}
            <br />
            {t.search.emptyHint2}
          </p>
        </div>
      )}
    </div>
  )
}
