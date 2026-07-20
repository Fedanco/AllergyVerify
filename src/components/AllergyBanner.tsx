import { labelForTag, matchAllergens } from '../data/allergenCatalog'
import { useLang } from '../i18n/useLang'
import { TONE_GLOW, TONE_SURFACE, type Tone } from '../lib/allergyTone'
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

// Colore del corpo testo a piena opacità, tinto verso --color-ink invece di
// usare opacity sul colore di tono: l'opacità riduce la luminanza su uno
// sfondo scuro (l'opposto di quel che serve per leggerlo bene); questi
// valori restano riconoscibili come "quel tono" mantenendo il contrasto alto.
const BODY_COLOR: Record<Tone, string> = {
  danger: '#f97482',
  warn: '#f8c482',
  safe: '#66e7bd',
  neutral: 'var(--color-ink-dim)',
}

// Chip tonale dietro l'icona: la distingue da un'icona nuda e la rende
// leggibile come il primo elemento su cui l'occhio si posa nel banner.
const ICON_CHIP: Record<Tone, string> = {
  danger: 'bg-danger/15 text-danger',
  warn: 'bg-warn/15 text-warn',
  safe: 'bg-accent/15 text-accent',
  neutral: 'bg-surface text-ink-dim',
}

function Pill({
  tone,
  Icon,
  title,
  children,
}: {
  tone: Tone
  Icon: (p: { className?: string }) => React.ReactNode
  title: string
  children: React.ReactNode
}) {
  const glow = TONE_GLOW[tone]
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-banner border px-5 py-4 ${TONE_SURFACE[tone]} ${glow ?? ''} ${
        tone === 'danger' ? 'animate-banner-in-danger' : 'animate-banner-in'
      }`}
    >
      <span
        className={`animate-icon-pop flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ICON_CHIP[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-base font-bold">{title}</p>
        <p className="mt-0.5 text-sm" style={{ color: BODY_COLOR[tone] }}>
          {children}
        </p>
      </div>
    </div>
  )
}
