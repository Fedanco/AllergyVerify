import { useNavigate } from 'react-router-dom'
import { BackIcon } from '../components/Icons'
import PageHeader from '../components/PageHeader'
import { useLang } from '../i18n/useLang'

/** Pagina Termini e responsabilità: stesso pattern di PrivacyPage.tsx. */
export default function TermsPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const s = t.terms

  return (
    <div className="animate-fade-up">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="focus-ring mb-4 flex items-center gap-1 rounded text-sm text-ink-dim transition-colors hover:text-ink"
      >
        <BackIcon className="h-4 w-4" /> {t.productDetail.back}
      </button>

      <PageHeader title={s.title} subtitle={s.updated} />

      <div className="flex flex-col gap-3">
        <p className="text-sm leading-relaxed text-ink-dim">{s.intro}</p>

        <Section title={s.purposeTitle} body={s.purposeBody} />
        {/* La sezione più importante dal punto di vista legale: niente
            garanzia sui dati di terze parti. Va tenuta prominente, non in
            fondo alla pagina. */}
        <Section title={s.accuracyTitle} body={s.accuracyBody} highlight />
        <Section title={s.medicalTitle} body={s.medicalBody} highlight />
        <Section title={s.liabilityTitle} body={s.liabilityBody} highlight />
        <Section title={s.licenseTitle} body={s.licenseBody} />
        <Section title={s.changesTitle} body={s.changesBody} />
      </div>
    </div>
  )
}

function Section({
  title,
  body,
  highlight = false,
}: {
  title: string
  body: string
  highlight?: boolean
}) {
  return (
    <section className={`card p-4 ${highlight ? 'border-warn/30 bg-warn/5' : ''}`}>
      <h2 className="mb-1.5 text-sm font-semibold">{title}</h2>
      <p className="text-sm leading-relaxed text-ink-dim">{body}</p>
    </section>
  )
}
