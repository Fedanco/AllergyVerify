import { useNavigate } from 'react-router-dom'
import { BackIcon } from '../components/Icons'
import PageHeader from '../components/PageHeader'
import { useLang } from '../i18n/useLang'

/**
 * Pagina Privacy: raggiunta da Impostazioni, non fa parte della tab bar.
 * Sezioni in card separate invece di un unico blocco di testo, per restare
 * scorribile anche su schermi piccoli.
 */
export default function PrivacyPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const p = t.privacy

  return (
    <div className="animate-fade-up">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="focus-ring mb-4 flex items-center gap-1 rounded text-sm text-ink-dim transition-colors hover:text-ink"
      >
        <BackIcon className="h-4 w-4" /> {t.productDetail.back}
      </button>

      <PageHeader title={p.title} subtitle={p.updated} />

      <div className="flex flex-col gap-3">
        <p className="text-sm leading-relaxed text-ink-dim">{p.intro}</p>

        <Section title={p.controllerTitle}>
          <p>
            {p.controllerBody}
            <a
              href={`mailto:${p.contactEmail}`}
              className="focus-ring rounded text-accent underline-offset-2 hover:underline"
            >
              {p.contactEmail}
            </a>
            .
          </p>
        </Section>

        <Section title={p.dataTitle}>
          <p>{p.dataBody}</p>
        </Section>

        <Section title={p.thirdPartiesTitle}>
          <p>{p.thirdPartiesIntro}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {p.thirdParties.map((tp) => (
              <li key={tp.name}>
                <span className="font-semibold text-ink">{tp.name}</span> — {tp.body}
              </li>
            ))}
          </ul>
        </Section>

        <Section title={p.cookiesTitle}>
          <p>{p.cookiesBody}</p>
        </Section>

        <Section title={p.rightsTitle}>
          <p>{p.rightsBody}</p>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-4">
      <h2 className="mb-1.5 text-sm font-semibold">{title}</h2>
      <div className="text-sm leading-relaxed text-ink-dim">{children}</div>
    </section>
  )
}
