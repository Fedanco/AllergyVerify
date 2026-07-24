import { useState } from 'react'
import { AlertIcon } from '../components/Icons'
import InstallGuideModal from '../components/InstallGuideModal'
import InstallNativeModal from '../components/InstallNativeModal'
import PageHeader from '../components/PageHeader'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { useLang } from '../i18n/useLang'
import type { Lang } from '../i18n/translations'

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'it', label: '🇮🇹 Italiano' },
  { value: 'en', label: '🇬🇧 English' },
]

export default function SettingsPage() {
  const { lang, setLang, t } = useLang()
  const { standalone, isIOS, canInstallNative, promptInstall } = useInstallPrompt()
  const [guideOpen, setGuideOpen] = useState(false)
  const [nativeIntroOpen, setNativeIntroOpen] = useState(false)

  return (
    <div>
      <PageHeader title={t.settings.title} subtitle={t.settings.subtitle} />

      <div className="flex flex-col gap-3">
        <img
          src="./logo.png"
          alt="Logo AllergyScan"
          className="mx-auto h-24 w-24"
        />

        <section className="card p-4">
          <h2 className="mb-2 text-sm font-semibold">{t.settings.languageTitle}</h2>
          <div role="group" aria-label={t.settings.languageTitle} className="flex gap-2">
            {LANG_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setLang(value)}
                aria-pressed={lang === value}
                className={`focus-ring flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  lang === value
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-edge bg-surface-2 text-ink-dim hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-1 text-sm font-semibold">{t.settings.aboutTitle}</h2>
          <p className="text-sm text-ink-dim">{t.settings.aboutBody}</p>
        </section>

        <section className="card p-4">
          <h2 className="mb-1 text-sm font-semibold">{t.settings.dataTitle}</h2>
          <p className="text-sm text-ink-dim">
            {t.settings.dataBody1}
            <a
              href="https://world.openfoodfacts.org"
              target="_blank"
              rel="noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              Open Food Facts
            </a>
            {t.settings.dataBody2}
          </p>
        </section>

        {!standalone && (
          <section className="card p-4">
            <h2 className="mb-1 text-sm font-semibold">{t.settings.installTitle}</h2>
            {canInstallNative || isIOS ? (
              <>
                <p className="text-sm text-ink-dim">{t.settings.installBody}</p>
                <button
                  type="button"
                  onClick={
                    canInstallNative ? () => setNativeIntroOpen(true) : () => setGuideOpen(true)
                  }
                  className="focus-ring mt-3 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg transition-transform duration-[var(--duration-fast)] active:scale-[0.97]"
                >
                  {canInstallNative ? t.settings.installCta : t.settings.installCtaGuide}
                </button>
              </>
            ) : (
              <p className="text-sm text-ink-dim">
                {t.settings.installBody1}
                <span className="text-ink">{t.settings.installIos}</span>
                {t.settings.installBody2}
                <span className="text-ink">{t.settings.installAndroid}</span>
                {t.settings.installBody3}
              </p>
            )}
          </section>
        )}

        {/* Trattamento tonale (non decorativo): è un vero avviso medico,
            merita di distinguersi dalle altre sezioni informative sopra. */}
        <section className="card border-warn/30 bg-warn/5 p-4">
          <h2 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-warn">
            <AlertIcon className="h-4 w-4" /> {t.settings.warningTitle}
          </h2>
          <p className="text-sm text-ink-dim">{t.settings.warningBody}</p>
        </section>

        <p className="mt-2 text-center text-xs text-ink-dim/60">
          AllergyScan Web · v0.5.1
        </p>
      </div>

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
