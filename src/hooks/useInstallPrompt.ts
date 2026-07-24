import { useCallback, useSyncExternalStore } from 'react'
import type { BeforeInstallPromptEvent } from '../types/pwa'

const DISMISSED_KEY = 'as_install_dismissed'

function isStandaloneMode(): boolean {
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true
}

function isIOSDevice(): boolean {
  const ua = window.navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return true
  // iPadOS 13+: Safari si dichiara "Macintosh" ma espone il multi-touch
  return ua.includes('Macintosh') && navigator.maxTouchPoints > 1
}

function loadDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

interface State {
  deferredPrompt: BeforeInstallPromptEvent | null
  dismissed: boolean
}

let state: State = { deferredPrompt: null, dismissed: loadDismissed() }
const listeners = new Set<() => void>()

function commit(next: State) {
  state = next
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Registrati una sola volta a livello di modulo, non dentro un useEffect
// legato a un componente: beforeinstallprompt viene disparato dal browser
// una volta sola, e se il listener vivesse solo mentre una pagina specifica
// e' montata (es. Home) l'evento andrebbe perso navigando altrove (es.
// Impostazioni) prima che l'utente decida di installare.
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  commit({ ...state, deferredPrompt: e })
})
window.addEventListener('appinstalled', () => {
  commit({ deferredPrompt: null, dismissed: true })
  try {
    localStorage.setItem(DISMISSED_KEY, '1')
  } catch {
    // solo per la sessione corrente
  }
})

const standalone = isStandaloneMode()
const isIOS = isIOSDevice()

export function useInstallPrompt() {
  const snapshot = useSyncExternalStore(subscribe, () => state)

  const dismiss = useCallback(() => {
    commit({ ...state, dismissed: true })
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // solo per la sessione corrente
    }
  }, [])

  const promptInstall = useCallback(async () => {
    const event = state.deferredPrompt
    if (!event) return
    try {
      await event.prompt()
      await event.userChoice
    } finally {
      commit({ ...state, deferredPrompt: null })
    }
  }, [])

  return {
    standalone,
    isIOS,
    canInstallNative: snapshot.deferredPrompt !== null,
    dismissed: snapshot.dismissed,
    dismiss,
    promptInstall,
  }
}
