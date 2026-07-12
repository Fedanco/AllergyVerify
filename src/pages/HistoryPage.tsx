import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import { TrashIcon } from '../components/Icons'
import { useAllergyProfile } from '../hooks/useAllergyProfile'
import { useScanHistory } from '../hooks/useScanHistory'

export default function HistoryPage() {
  const { history, clearHistory } = useScanHistory()
  const { activeProfile } = useAllergyProfile()

  return (
    <div>
      <div className="flex items-start justify-between">
        <PageHeader
          title="Storico"
          subtitle={`${history.length} prodott${history.length === 1 ? 'o' : 'i'} tra scansioni e ricerche`}
        />
        {history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm('Svuotare tutto lo storico?')) clearHistory()
            }}
            className="flex items-center gap-1.5 rounded-xl border border-edge px-3 py-2 text-xs text-ink-dim transition-colors hover:border-danger/40 hover:text-danger"
          >
            <TrashIcon className="h-4 w-4" /> Svuota
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="card px-5 py-8 text-center">
          <p className="text-3xl">🕘</p>
          <p className="mt-2 text-sm text-ink-dim">
            Lo storico è vuoto: i prodotti che scansioni o cerchi appariranno qui.
          </p>
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
                subtitle={`${e.source === 'scan' ? '📷 Scansione' : '🔍 Ricerca'} · ${formatDate(e.scannedAt)}`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
