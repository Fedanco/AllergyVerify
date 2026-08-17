import { useCallback, useSyncExternalStore } from 'react'
import type { AllergyProfile } from '../types/product'

const PROFILES_KEY = 'as_profiles'
const ACTIVE_KEY = 'as_active_profile'

type State = { profiles: AllergyProfile[]; activeId: string | null }

/**
 * Id di un profilo.
 *
 * `crypto.randomUUID()` esiste solo in secure context (HTTPS o localhost):
 * aprendo l'app da un IP di rete in HTTP — il modo normale di provarla dal
 * telefono durante lo sviluppo — non è definita, e il salvataggio del
 * profilo moriva con "crypto.randomUUID is not a function".
 *
 * L'id serve solo a distinguere i profili dentro questo dispositivo, non a
 * essere globalmente unico: tempo + casuale è più che sufficiente.
 */
function newProfileId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

let state: State = load()
const listeners = new Set<() => void>()

function load(): State {
  try {
    const profiles = JSON.parse(
      localStorage.getItem(PROFILES_KEY) ?? '[]',
    ) as AllergyProfile[]
    const activeId = localStorage.getItem(ACTIVE_KEY)
    return {
      profiles,
      activeId: profiles.some((p) => p.id === activeId) ? activeId : (profiles[0]?.id ?? null),
    }
  } catch {
    return { profiles: [], activeId: null }
  }
}

function commit(next: State) {
  state = next
  localStorage.setItem(PROFILES_KEY, JSON.stringify(next.profiles))
  if (next.activeId) localStorage.setItem(ACTIVE_KEY, next.activeId)
  else localStorage.removeItem(ACTIVE_KEY)
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useAllergyProfile() {
  const snapshot = useSyncExternalStore(subscribe, () => state)

  const createProfile = useCallback((name: string, allergens: string[]) => {
    const profile: AllergyProfile = {
      id: newProfileId(),
      name: name.trim() || 'Profilo',
      allergens,
    }
    commit({
      profiles: [...state.profiles, profile],
      activeId: state.activeId ?? profile.id,
    })
    return profile
  }, [])

  const updateProfile = useCallback((id: string, name: string, allergens: string[]) => {
    commit({
      ...state,
      profiles: state.profiles.map((p) =>
        p.id === id ? { ...p, name: name.trim() || p.name, allergens } : p,
      ),
    })
  }, [])

  const deleteProfile = useCallback((id: string) => {
    const profiles = state.profiles.filter((p) => p.id !== id)
    commit({
      profiles,
      activeId: state.activeId === id ? (profiles[0]?.id ?? null) : state.activeId,
    })
  }, [])

  const setActive = useCallback((id: string) => {
    if (state.profiles.some((p) => p.id === id)) commit({ ...state, activeId: id })
  }, [])

  const activeProfile =
    snapshot.profiles.find((p) => p.id === snapshot.activeId) ?? null

  return {
    profiles: snapshot.profiles,
    activeProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    setActive,
  }
}
