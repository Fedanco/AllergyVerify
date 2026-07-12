interface Props {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: Props) {
  return (
    <header className="mb-6 animate-fade-up">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink-dim">{subtitle}</p>}
    </header>
  )
}
