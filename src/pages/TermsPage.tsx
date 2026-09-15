import { useNavigate } from 'react-router-dom'
import { BackIcon } from '../components/Icons'
import { useLang } from '../i18n/useLang'
import LegalPage from '../paper/LegalPage'

/** Pagina Termini e responsabilità: stesso pattern di PrivacyPage.tsx. */
export default function TermsPage() {
  const { lang, t } = useLang()
  const navigate = useNavigate()

  return (
    <div className="animate-fade-up">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="focus-ring mb-4 flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <BackIcon className="h-4 w-4" /> {t.productDetail.back}
      </button>

      <LegalPage kind="terms" lang={lang} warningLabel={t.settings.warningTitle} />
    </div>
  )
}
