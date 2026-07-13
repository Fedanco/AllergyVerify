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
      <div className="flex items-start justify-between">
        <PageHeader title={t.history.title} subtitle={t.history.subtitle(history.length)} />
        {history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm(t.history.confirmClear)) clearHistory()
            }}
            className="focus-ring flex items-center gap-1.5 rounded-xl border border-edge px-3 py-2 text-xs text-ink-dim transition-colors hover:border-danger/40 hover:text-danger"
          >
            <TrashIcon className="h-4 w-4" /> {t.history.clear}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="card px-5 py-8 text-center">
          <p className="text-3xl">🕘</p>
          <p className="mt-2 text-sm text-ink-dim">{t.history.empty}</p>
        </div>
      ) : (
        <ul className="flex animate-fade-up flex-col gap-2">
          {history.map((e) => (
            <li key={e.code}>
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
