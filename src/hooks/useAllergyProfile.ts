import { useCallback, useSyncExternalStore } from 'react'
import type { AllergyProfile } from '../types/product'

const PROFILES_KEY = 'as_profiles'
/** legacy: un solo id attivo. Ancora scritto, così tornare a una versione
 *  precedente dell'app non fa perdere la selezione. */
const ACTIVE_KEY = 'as_active_profile'
const ACTIVE_IDS_KEY = 'as_active_profiles'

/**
 * `activeIds` invece di un singolo id: in una famiglia ogni persona ha
 * allergie diverse e la spesa è una sola, quindi serve poter controllare un
 * prodotto per più persone insieme.
 *
 * Non c'è una "modalità multipla" da attivare: si spuntano i profili che
 * servono, uno o più d'uno. Resta comunque una scelta esplicita — l'app non
 * somma mai profili per conto suo — ma senza il passaggio in più di un
 * interruttore da accendere prima di poter selezionare.
 */
type State = {
  profiles: AllergyProfile[]
  activeIds: string[]
}

let state: State = load()
const listeners = new Set<() => void>()

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

function load(): State {
  try {
    const profiles = JSON.parse(
      localStorage.getItem(PROFILES_KEY) ?? '[]',
    ) as AllergyProfile[]
    const exists = (id: string) => profiles.some((p) => p.id === id)

    // Migrazione trasparente dal vecchio formato a id singolo.
    const stored = localStorage.getItem(ACTIVE_IDS_KEY)
    const parsed = stored ? (JSON.parse(stored) as string[]) : null
    const fromLegacy = localStorage.getItem(ACTIVE_KEY)
    const candidates = parsed ?? (fromLegacy ? [fromLegacy] : [])

    let activeIds = candidates.filter(exists)
    if (activeIds.length === 0 && profiles[0]) activeIds = [profiles[0].id]

    return { profiles, activeIds }
  } catch {
    return { profiles: [], activeIds: [] }
  }
}

function commit(next: State) {
  state = next
  localStorage.setItem(PROFILES_KEY, JSON.stringify(next.profiles))
  localStorage.setItem(ACTIVE_IDS_KEY, JSON.stringify(next.activeIds))
  if (next.activeIds[0]) localStorage.setItem(ACTIVE_KEY, next.activeIds[0])
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
      ...state,
      profiles: [...state.profiles, profile],
      // il primo profilo creato diventa attivo; gli altri no, altrimenti
      // ogni aggiunta cambierebbe il verdetto senza che nessuno lo chieda
      activeIds: state.activeIds.length === 0 ? [profile.id] : state.activeIds,
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
    let activeIds = state.activeIds.filter((a) => a !== id)
    if (activeIds.length === 0 && profiles[0]) activeIds = [profiles[0].id]
    commit({ ...state, profiles, activeIds })
  }, [])

  /** Rende attivo solo questo profilo. */
  const setActive = useCallback((id: string) => {
    if (state.profiles.some((p) => p.id === id)) {
      commit({ ...state, activeIds: [id] })
    }
  }, [])

  /**
   * Aggiunge o toglie un profilo dalla selezione. L'ultimo rimasto non si può
   * togliere: senza nessun profilo attivo l'app non saprebbe piu' per chi
   * esprimere un verdetto, e il tocco sembrerebbe semplicemente non funzionare.
   */
  const toggleActive = useCallback((id: string) => {
    if (!state.profiles.some((p) => p.id === id)) return
    const isOn = state.activeIds.includes(id)
    if (isOn && state.activeIds.length === 1) return
    const activeIds = isOn
      ? state.activeIds.filter((a) => a !== id)
      : [...state.activeIds, id]
    commit({ ...state, activeIds })
  }, [])

  const activeProfiles = snapshot.profiles.filter((p) =>
    snapshot.activeIds.includes(p.id),
  )

  return {
    profiles: snapshot.profiles,
    activeProfiles,
    /** primo profilo attivo: per le UI che ne mostrano uno solo */
    activeProfile: activeProfiles[0] ?? null,
    createProfile,
    updateProfile,
    deleteProfile,
    setActive,
    toggleActive,
  }
}
