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
        {/* Un gradino piu' piccolo su telefono, dove la colonna e' stretta:
            Outfit ha lettere piu' larghe di Inter, quindi alla stessa misura
            in punti occupa piu' spazio e "grida" di piu'. */}
        <h1 className="font-display text-[1.375rem] font-bold tracking-tight text-balance sm:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[0.8125rem] text-ink-dim sm:text-sm">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0 pt-0.5">{action}</div>}
    </header>
  )
}
