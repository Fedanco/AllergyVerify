import { useEffect, useRef } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  titleId: string
  children: React.ReactNode
}

export default function Modal({ open, onClose, titleId, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="animate-fade-up fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="animate-banner-in w-full max-w-sm rounded-banner border border-edge bg-surface p-5 shadow-lg focus:outline-none"
      >
        {children}
      </div>
    </div>
  )
}
