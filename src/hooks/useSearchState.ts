import { useCallback, useSyncExternalStore } from 'react'
import type { Product } from '../types/product'

/**
 * Stato della ricerca condiviso a livello di modulo (non su localStorage):
 * sopravvive al remount di SearchPage quando si torna indietro da un'altra
 * route (es. dalla scheda prodotto), ma si azzera con un reload della pagina.
 */
interface SearchState {
  query: string
  results: Product[] | null
  error: string | null
}

let state: SearchState = { query: '', results: null, error: null }
const listeners = new Set<() => void>()

function commit(patch: Partial<SearchState>) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSearchState() {
  const snapshot = useSyncExternalStore(subscribe, () => state)

  const setQuery = useCallback((query: string) => commit({ query }), [])
  const setResults = useCallback((results: Product[] | null) => commit({ results }), [])
  const setError = useCallback((error: string | null) => commit({ error }), [])

  return { ...snapshot, setQuery, setResults, setError }
}
