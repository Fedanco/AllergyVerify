import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductByBarcode, searchProducts } from '../api/openFoodFacts'
import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import { SearchIcon } from '../components/Icons'
import { useAllergyProfile } from '../hooks/useAllergyProfile'
import { LookupError, type Product } from '../types/product'

const ERROR_MESSAGES: Record<string, string> = {
  'not-found': 'Nessun prodotto trovato. Controlla il codice o prova con il nome.',
  offline: 'Sei offline: connettiti a internet e riprova.',
  timeout: 'La richiesta ha impiegato troppo tempo. Riprova.',
  error: 'Si è verificato un errore. Riprova tra poco.',
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { activeProfile } = useAllergyProfile()
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
        if (products.length === 0) setError(ERROR_MESSAGES['not-found'])
        else setResults(products)
      }
    } catch (err) {
      const kind = err instanceof LookupError ? err.kind : 'error'
      setError(ERROR_MESSAGES[kind])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Cerca un prodotto"
        subtitle="Inserisci un codice a barre o il nome di un prodotto"
      />

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-dim" />
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="es. 8076809513753 o «biscotti»"
            className="w-full rounded-2xl border border-edge bg-surface py-3 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-ink-dim/60 focus:border-accent"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-2xl bg-accent px-5 text-sm font-semibold text-bg transition-opacity disabled:opacity-40"
        >
          {loading ? '…' : 'Cerca'}
        </button>
      </form>

      {error && (
        <p className="animate-fade-up rounded-2xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn">
          {error}
        </p>
      )}

      {results && (
        <ul className="flex animate-fade-up flex-col gap-2">
          {results.map((p) => (
            <li key={p.code}>
              <ProductCard
                code={p.code}
                name={p.product_name ?? 'Prodotto senza nome'}
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
          <p className="text-3xl">🔍</p>
          <p className="mt-2 text-sm text-ink-dim">
            Cerca per codice a barre per un risultato esatto,
            <br />
            oppure per nome per esplorare i prodotti.
          </p>
        </div>
      )}
    </div>
  )
}
