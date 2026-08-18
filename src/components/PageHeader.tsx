interface Props {
  title: string
  subtitle?: string
  /** Azione allineata a destra, es. il pulsante "svuota" dello Storico. */
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-balance">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-dim">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 pt-0.5">{action}</div>}
    </header>
  )
}
