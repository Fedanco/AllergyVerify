import { labelForTag, matchAllergens } from '../data/allergenCatalog'
import { useLang } from '../i18n/useLang'
import type { AllergyProfile } from '../types/product'
import { AlertIcon, CheckIcon, InfoIcon } from './Icons'

interface Props {
  allergensTags: string[] | undefined
  /** tag "può contenere" (tracce) del prodotto */
  tracesTags?: string[]
  profile: AllergyProfile | null
}

/**
 * Badge/pill di verdetto allergie:
 * - rosso: almeno un allergene del profilo attivo e' presente
 * - arancio: nessun allergene diretto ma tracce ("può contenere") del profilo
 * - verde neon: nessun allergene del profilo rilevato
 * - neutro: nessun profilo attivo o dati allergeni mancanti
 */
export default function AllergyBanner({ allergensTags, tracesTags, profile }: Props) {
  const { lang, t } = useLang()

  if (!profile) {
    return (
      <Pill tone="neutral" Icon={InfoIcon} title={t.allergyBanner.noProfileTitle}>
        {t.allergyBanner.noProfileBody}
      </Pill>
    )
  }

  if (!allergensTags) {
    return (
      <Pill tone="neutral" Icon={InfoIcon} title={t.allergyBanner.noDataTitle}>
        {t.allergyBanner.noDataBody}
      </Pill>
    )
  }

  const detected = matchAllergens(allergensTags, profile.allergens)
  const traces = matchAllergens(tracesTags, profile.allergens).filter(
    (tag) => !detected.includes(tag),
  )
  const toLabels = (tags: string[]) =>
    tags.map((tag) => labelForTag(tag, lang)).join(', ')

  if (detected.length > 0) {
    return (
      <>
        <Pill tone="danger" Icon={AlertIcon} title={t.allergyBanner.dangerTitle(profile.name)}>
          {t.allergyBanner.contains(toLabels(detected))}
        </Pill>
        {traces.length > 0 && <TracesPill traces={toLabels(traces)} />}
      </>
    )
  }

  if (traces.length > 0) {
    return (
      <>
        <Pill tone="safe" Icon={CheckIcon} title={t.allergyBanner.safeWithTracesTitle}>
          {t.allergyBanner.safeWithTracesBody}
        </Pill>
        <TracesPill traces={toLabels(traces)} />
      </>
    )
  }

  return (
    <Pill tone="safe" Icon={CheckIcon} title={t.allergyBanner.safeTitle}>
      {t.allergyBanner.safeBody(profile.name)}
    </Pill>
  )
}

function TracesPill({ traces }: { traces: string }) {
  const { t } = useLang()
  return (
    <Pill tone="warn" Icon={AlertIcon} title={t.allergyBanner.tracesTitle}>
      {t.allergyBanner.mayContain(traces)}
    </Pill>
  )
}

const TONES = {
  danger: 'border-danger/40 bg-danger/10 text-danger',
  warn: 'border-warn/40 bg-warn/10 text-warn',
  safe: 'border-accent/40 bg-accent/10 text-accent',
  neutral: 'border-edge bg-surface-2 text-ink-dim',
}

function Pill({
  tone,
  Icon,
  title,
  children,
}: {
  tone: keyof typeof TONES
  Icon: (p: { className?: string }) => React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${TONES[tone]}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs opacity-80">{children}</p>
      </div>
    </div>
  )
}
