import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import { TrashIcon } from '../components/Icons'
import { useAllergyProfile } from '../hooks/useAllergyProfile'
import { useScanHistory } from '../hooks/useScanHistory'
import { useLang } from '../i18n/useLang'

export default function HistoryPage() {
  const { history, clearHistory } = useScanHistory()
  const { activeProfile } = useAllergyProfile()
  const { t } = useLang()

  return (
    <div>
      <PageHeader
        title={t.history.title}
        subtitle={t.history.subtitle(history.length)}
        action={
          history.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm(t.history.confirmClear)) clearHistory()
              }}
              className="focus-ring flex items-center gap-1.5 rounded-xl border border-edge px-3 py-2 text-xs text-ink-dim transition-colors duration-[var(--duration-fast)] hover:border-danger/40 hover:text-danger"
            >
              <TrashIcon className="h-4 w-4" /> {t.history.clear}
            </button>
          )
        }
      />

      {history.length === 0 ? (
        <div className="card px-5 py-8 text-center">
          <p aria-hidden className="text-3xl">🕘</p>
          <p className="mt-2 text-sm text-ink-dim">{t.history.empty}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {history.map((e, i) => (
            <li
              key={e.code}
              style={{ '--i': Math.min(i, 8) } as React.CSSProperties}
              className="animate-step-in [animation-delay:calc(var(--i)*40ms)]"
            >
              <ProductCard
                code={e.code}
                name={e.name}
                brands={e.brands}
                imageUrl={e.imageUrl}
                allergensTags={e.allergensTags}
                profile={activeProfile}
                subtitle={`${e.source === 'scan' ? t.history.sourceScan : t.history.sourceSearch} · ${formatDate(e.scannedAt, t.history.dateLocale)}`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function formatDate(ts: number, locale: string): string {
  return new Date(ts).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
