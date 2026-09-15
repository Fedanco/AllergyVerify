import { useNavigate } from 'react-router-dom'
import { BackIcon } from '../components/Icons'
import { useLang } from '../i18n/useLang'
import LegalPage from '../paper/LegalPage'

/**
 * Pagina Privacy: raggiunta da Info, non fa parte della tab bar. È la stessa
 * pagina di carta del sito (src/paper/LegalPage, testi in legal.ts), con in
 * più il bottone per tornare indietro.
 */
export default function PrivacyPage() {
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

      <LegalPage kind="privacy" lang={lang} warningLabel={t.settings.warningTitle} />
    </div>
  )
}
