import { useCallback, useSyncExternalStore } from 'react'
import { getIngredientsRawText } from '../data/allergenCatalog'
import type { HistoryEntry, Product } from '../types/product'

const HISTORY_KEY = 'as_history'
const MAX_ENTRIES = 50

let entries: HistoryEntry[] = load()
const listeners = new Set<() => void>()

function load(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') as HistoryEntry[]
  } catch {
    return []
  }
}

function commit(next: HistoryEntry[]) {
  entries = next
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useScanHistory() {
  const history = useSyncExternalStore(subscribe, () => entries)

  const addEntry = useCallback((product: Product, source: HistoryEntry['source']) => {
    const entry: HistoryEntry = {
      code: product.code,
      name: product.product_name ?? 'Prodotto senza nome',
      brands: product.brands ?? '',
      imageUrl: product.image_front_url ?? '',
      allergensTags: product.allergens_tags ?? [],
      tracesTags: product.traces_tags ?? [],
      ingredientsText: getIngredientsRawText(product),
      scannedAt: Date.now(),
      source,
    }
    // il piu' recente in testa, senza duplicati per barcode
    commit([entry, ...entries.filter((e) => e.code !== entry.code)].slice(0, MAX_ENTRIES))
  }, [])

  const removeEntry = useCallback((code: string) => {
    commit(entries.filter((e) => e.code !== code))
  }, [])

  const clearHistory = useCallback(() => commit([]), [])

  return { history, addEntry, removeEntry, clearHistory }
}
