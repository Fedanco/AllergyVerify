import PageHeader from '../components/PageHeader'
import { useLang } from '../i18n/useLang'
import type { Lang } from '../i18n/translations'

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'it', label: '🇮🇹 Italiano' },
  { value: 'en', label: '🇬🇧 English' },
]

export default function SettingsPage() {
  const { lang, setLang, t } = useLang()

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
          <div className="flex gap-2">
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

        <section className="card p-4">
          <h2 className="mb-1 text-sm font-semibold">{t.settings.installTitle}</h2>
          <p className="text-sm text-ink-dim">
            {t.settings.installBody1}
            <span className="text-ink">{t.settings.installIos}</span>
            {t.settings.installBody2}
            <span className="text-ink">{t.settings.installAndroid}</span>
            {t.settings.installBody3}
          </p>
        </section>

        <section className="card p-4">
          <h2 className="mb-1 text-sm font-semibold">{t.settings.warningTitle}</h2>
          <p className="text-sm text-ink-dim">{t.settings.warningBody}</p>
        </section>

        <p className="mt-2 text-center text-xs text-ink-dim/60">
          AllergyScan Web · v0.3.1
        </p>
      </div>
    </div>
  )
}
