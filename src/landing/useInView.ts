import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * `true` la prima volta che l'elemento entra nello schermo (poi resta
 * `true`). Serve a far partire i tratti che si disegnano quando la sezione è
 * davvero visibile e non al caricamento. Senza IntersectionObserver risponde
 * subito `true`: meglio un tratto già disegnato che un tratto mai apparso.
 */
export function useInView<T extends HTMLElement>(threshold = 0.35): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, inView]
}
