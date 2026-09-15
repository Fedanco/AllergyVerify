interface Props {
  title: string
  subtitle?: string
  /** Azione allineata a destra, es. il pulsante "svuota" dello Storico. */
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <header className="mb-5 flex items-start justify-between gap-4 animate-fade-up">
      <div>
        {/* Titolo scritto a mano, come sulla landing. Permanent Marker ha
            un peso solo: niente `font-bold`, il grassetto sintetico lo
            impasta. Fluido con clamp: su telefono la colonna è stretta. */}
        <h1 className="font-hand text-[clamp(1.9rem,6vw,2.4rem)] leading-[1.08] text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[0.8125rem] text-ink-soft sm:text-sm">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0 pt-0.5">{action}</div>}
    </header>
  )
}
