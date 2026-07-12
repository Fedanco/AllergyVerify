import { LookupError, type Product } from '../types/product'

const BASE = 'https://world.openfoodfacts.org'
const FIELDS =
  'code,product_name,brands,image_front_url,allergens_tags,categories_tags,nutriments,nutriscore_grade'
const TIMEOUT_MS = 10_000
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const CACHE_PREFIX = 'as_product_cache:'

const memoryCache = new Map<string, Product>()

function readStoredCache(code: string): Product | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + code)
    if (!raw) return null
    const { at, product } = JSON.parse(raw) as { at: number; product: Product }
    if (Date.now() - at > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_PREFIX + code)
      return null
    }
    return product
  } catch {
    return null
  }
}

function writeStoredCache(code: string, product: Product) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + code,
      JSON.stringify({ at: Date.now(), product }),
    )
  } catch {
    // storage pieno: la cache in memoria basta
  }
}

async function fetchJson(url: string): Promise<unknown> {
  if (!navigator.onLine) throw new LookupError('offline', 'Sei offline')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new LookupError('error', `Errore server (${res.status})`)
    return await res.json()
  } catch (err) {
    if (err instanceof LookupError) throw err
    if (err instanceof DOMException && err.name === 'AbortError')
      throw new LookupError('timeout', 'Richiesta scaduta, riprova')
    throw new LookupError(
      navigator.onLine ? 'error' : 'offline',
      'Impossibile contattare il server',
    )
  } finally {
    clearTimeout(timer)
  }
}

/** Lookup prodotto per barcode, con cache (memoria + localStorage, TTL 24h). */
export async function getProductByBarcode(barcode: string): Promise<Product> {
  const code = barcode.trim()
  const cached = memoryCache.get(code) ?? readStoredCache(code)
  if (cached) {
    memoryCache.set(code, cached)
    return cached
  }

  const data = (await fetchJson(
    `${BASE}/api/v2/product/${encodeURIComponent(code)}?fields=${FIELDS}`,
  )) as { status: number; product?: Product }

  if (data.status !== 1 || !data.product)
    throw new LookupError('not-found', 'Prodotto non trovato')

  const product = { ...data.product, code }
  memoryCache.set(code, product)
  writeStoredCache(code, product)
  return product
}

/** Ricerca testuale per nome prodotto. */
export async function searchProducts(query: string): Promise<Product[]> {
  const params = new URLSearchParams({
    search_terms: query.trim(),
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '20',
    fields: FIELDS,
  })
  const data = (await fetchJson(`${BASE}/cgi/search.pl?${params}`)) as {
    products?: Product[]
  }
  return (data.products ?? []).filter((p) => p.code)
}
