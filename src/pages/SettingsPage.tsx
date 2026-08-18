import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DatabaseIcon,
  DocumentIcon,
  GlobeIcon,
  HomeAddIcon,
  InfoIcon,
  ShieldIcon,
} from '../components/Icons'
import LogoTile from '../components/LogoTile'
import InstallGuideModal from '../components/InstallGuideModal'
import InstallNativeModal from '../components/InstallNativeModal'
import PageHeader from '../components/PageHeader'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { useLang } from '../i18n/useLang'
import type { Lang } from '../i18n/translations'

const APP_VERSION = 'v0.6.1'

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'it', label: '🇮🇹 Italiano' },
  { value: 'en', label: '🇬🇧 English' },
]

/**
 * Pagina Info. Righe raggruppate con un disco icona a sinistra invece di una
 * pila di paragrafi: i testi lunghi (cos'è, dati) stanno dietro una riga che
 * si apre, così la pagina si legge a colpo d'occhio e chi cerca una cosa
 * precisa la trova senza attraversare tutto il resto.
 */
export default function SettingsPage() {
  const { lang, setLang, t } = useLang()
  const { standalone, isIOS, canInstallNative, promptInstall } = useInstallPrompt()
  const [open, setOpen] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState(false)
  const [nativeIntroOpen, setNativeIntroOpen] = useState(false)

  const toggle = (id: string) => setOpen((cur) => (cur === id ? null : id))
  const currentLang = LANG_OPTIONS.find((o) => o.value === lang)

  return (
    <div>
      <PageHeader title={t.settings.title} />

      {/* Identità dell'app: logo, nome e versione in un blocco solo. Prima il
          logo galleggiava scollegato sopra le sezioni. */}
      <div className="card mb-3 flex items-center gap-3.5 p-4">
        <LogoTile className="h-14" />
        <div className="min-w-0">
          <p className="font-display text-base font-bold">AllergyVerify</p>
          <p className="mt-0.5 text-xs text-ink-dim">{APP_VERSION}</p>
        </div>
      </div>

      <div className="card mb-3 divide-y divide-edge">
        <Row
          Icon={GlobeIcon}
          label={t.settings.languageTitle}
          value={currentLang?.label}
          expanded={open === 'lang'}
          onClick={() => toggle('lang')}
        >
          <div role="group" aria-label={t.settings.languageTitle} className="flex gap-2">
            {LANG_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setLang(value)}
                aria-pressed={lang === value}
                className={`focus-ring flex-1 rounded-xl px-3 py-2 text-sm transition-[background-color,box-shadow,color] duration-[var(--duration-fast)] ${
                  lang === value
                    ? 'inset-surface font-semibold text-accent'
                    : 'chip font-medium text-ink-dim hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Row>

        {!standalone && (
          <Row
            Icon={HomeAddIcon}
            label={t.settings.installTitle}
            /* Su iOS l'installazione non è un'azione che il sito può lanciare:
               la si spiega. Su Android il browser espone il prompt, quindi la
               riga porta dritta al punto invece di aprire un testo. */
            onClick={
              canInstallNative
                ? () => setNativeIntroOpen(true)
                : isIOS
                  ? () => setGuideOpen(true)
                  : () => toggle('install')
            }
            expanded={open === 'install'}
            arrow={canInstallNative || isIOS ? 'go' : 'expand'}
          >
            <p className="text-sm leading-relaxed text-ink-dim">
              {t.settings.installBody1}
              <span className="text-ink">{t.settings.installIos}</span>
              {t.settings.installBody2}
              <span className="text-ink">{t.settings.installAndroid}</span>
              {t.settings.installBody3}
            </p>
          </Row>
        )}
      </div>

      <div className="card mb-3 divide-y divide-edge">
        <Row
          Icon={InfoIcon}
          label={t.settings.aboutTitle}
          expanded={open === 'about'}
          onClick={() => toggle('about')}
        >
          <p className="text-sm leading-relaxed text-ink-dim">{t.settings.aboutBody}</p>
        </Row>

        <Row
          Icon={DatabaseIcon}
          label={t.settings.dataTitle}
          expanded={open === 'data'}
          onClick={() => toggle('data')}
        >
          <p className="text-sm leading-relaxed text-ink-dim">
            {t.settings.dataBody1}
            <a
              href="https://world.openfoodfacts.org"
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded text-accent underline-offset-2 hover:underline"
            >
              Open Food Facts
            </a>
            {t.settings.dataBody2}
          </p>
        </Row>

        {/* Link diretti, non righe espandibili: sono documenti a sé, non
            testo da leggere qui dentro. */}
        <Link
          to="/privacy"
          className="focus-ring flex w-full items-center gap-3 p-4 text-left transition-colors duration-[var(--duration-fast)] hover:bg-surface-2"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-dim">
            <ShieldIcon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1 text-sm font-semibold">
            {t.settings.privacyRowTitle}
          </span>
          <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-dim" />
        </Link>
        <Link
          to="/terms"
          className="focus-ring flex w-full items-center gap-3 p-4 text-left transition-colors duration-[var(--duration-fast)] hover:bg-surface-2"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-dim">
            <DocumentIcon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1 text-sm font-semibold">
            {t.settings.termsRowTitle}
          </span>
          <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-dim" />
        </Link>
      </div>

      {/* L'unica sezione sempre aperta: è un avviso medico, nasconderlo dietro
          un tocco significherebbe che quasi nessuno lo leggerebbe. */}
      <section className="card border-warn/30 bg-warn/5 p-4">
        <h2 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-warn">
          <AlertIcon className="h-4 w-4" /> {t.settings.warningTitle}
        </h2>
        <p className="text-sm leading-relaxed text-ink-dim">{t.settings.warningBody}</p>
      </section>

      <InstallGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <InstallNativeModal
        open={nativeIntroOpen}
        onClose={() => setNativeIntroOpen(false)}
        onContinue={() => {
          setNativeIntroOpen(false)
          promptInstall()
        }}
      />
    </div>
  )
}

function Row({
  Icon,
  label,
  value,
  expanded,
  onClick,
  arrow = 'expand',
  children,
}: {
  Icon: (p: { className?: string }) => React.ReactNode
  label: string
  /** valore corrente mostrato a destra (es. la lingua scelta) */
  value?: string
  expanded: boolean
  onClick: () => void
  /** 'expand' apre il contenuto sotto, 'go' porta altrove */
  arrow?: 'expand' | 'go'
  children: React.ReactNode
}) {
  const isExpandable = arrow === 'expand'
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isExpandable ? expanded : undefined}
        className="focus-ring flex w-full items-center gap-3 p-4 text-left transition-colors duration-[var(--duration-fast)] hover:bg-surface-2"
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-[var(--duration-fast)] ${
            expanded ? 'bg-accent text-bg' : 'bg-surface-2 text-ink-dim'
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1 text-sm font-semibold">{label}</span>
        {value && <span className="shrink-0 text-sm text-ink-dim">{value}</span>}
        <span
          aria-hidden
          className={`shrink-0 text-ink-dim transition-transform duration-[var(--duration-fast)] ${
            isExpandable && expanded ? 'rotate-180' : ''
          }`}
        >
          {isExpandable ? (
            <ChevronDownIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </span>
      </button>
      {isExpandable && expanded && (
        <div className="animate-fade-up px-4 pb-4">{children}</div>
      )}
    </div>
  )
}
