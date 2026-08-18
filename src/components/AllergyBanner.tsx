import { checkAllergens, emojiForTag, labelForTag } from '../data/allergenCatalog'
import { useLang } from '../i18n/useLang'
import { TONE_GLOW, TONE_SURFACE, type Tone } from '../lib/allergyTone'
import type { AllergyProfile, Product } from '../types/product'
import { AlertIcon, CheckIcon, InfoIcon } from './Icons'

interface Props {
  product: Product
  profile: AllergyProfile | null
}

/**
 * Verdetto allergie: l'oggetto principale della pagina prodotto.
 * - rosso: almeno un allergene del profilo attivo e' presente
 * - arancio: nessun allergene diretto ma tracce ("può contenere") del profilo
 * - verde: nessun allergene del profilo rilevato
 * - neutro: nessun profilo attivo o dati allergeni mancanti
 */
export default function AllergyBanner({ product, profile }: Props) {
  const { t } = useLang()

  if (!profile) {
    return (
      <Pill tone="neutral" Icon={InfoIcon} title={t.allergyBanner.noProfileTitle}>
        {t.allergyBanner.noProfileBody}
      </Pill>
    )
  }

  const { detected, traces, hasData } = checkAllergens(product, profile.allergens)

  if (!hasData) {
    return (
      <Pill tone="neutral" Icon={InfoIcon} title={t.allergyBanner.noDataTitle}>
        {t.allergyBanner.noDataBody}
      </Pill>
    )
  }

  if (detected.length > 0) {
    return (
      <>
        <Pill
          tone="danger"
          Icon={AlertIcon}
          title={t.allergyBanner.dangerTitle(profile.name)}
          tags={detected}
        >
          {t.allergyBanner.containsLabel}
        </Pill>
        {traces.length > 0 && <TracesPill traces={traces} />}
      </>
    )
  }

  if (traces.length > 0) {
    return (
      <>
        <Pill tone="safe" Icon={CheckIcon} title={t.allergyBanner.safeWithTracesTitle}>
          {t.allergyBanner.safeWithTracesBody}
        </Pill>
        <TracesPill traces={traces} />
      </>
    )
  }

  return (
    <Pill tone="safe" Icon={CheckIcon} title={t.allergyBanner.safeTitle}>
      {t.allergyBanner.safeBody(profile.name)}
    </Pill>
  )
}

function TracesPill({ traces }: { traces: string[] }) {
  const { t } = useLang()
  return (
    <Pill tone="warn" Icon={AlertIcon} title={t.allergyBanner.tracesTitle} tags={traces}>
      {t.allergyBanner.mayContainLabel}
    </Pill>
  )
}

// Colore del corpo testo a piena opacità, tinto verso --color-ink invece di
// usare opacity sul colore di tono: l'opacità riduce la luminanza su uno
// sfondo scuro (l'opposto di quel che serve per leggerlo bene); questi
// valori restano riconoscibili come "quel tono" mantenendo il contrasto alto.
const BODY_COLOR: Record<Tone, string> = {
  danger: '#ffa8ae',
  warn: '#ffd79a',
  safe: '#8fefc4',
  neutral: 'var(--color-ink-dim)',
}

// Disco a colore PIENO, non tinta trasparente: è il punto di colore più
// saturo della schermata e si legge da lontano, prima ancora delle parole.
// Una tinta al 15% su fondo scuro diventa un grigio colorato e sparisce.
const ICON_CHIP: Record<Tone, string> = {
  danger: 'bg-danger text-bg',
  warn: 'bg-warn text-bg',
  safe: 'bg-safe text-bg',
  neutral: 'bg-surface-3 text-ink-dim',
}

function Pill({
  tone,
  Icon,
  title,
  children,
  tags,
}: {
  tone: Tone
  Icon: (p: { className?: string }) => React.ReactNode
  title: string
  children: React.ReactNode
  /** allergeni da elencare come chip sotto il titolo (tag normalizzati) */
  tags?: string[]
}) {
  const { lang } = useLang()
  const glow = TONE_GLOW[tone]
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3.5 rounded-banner border px-4 py-4 sm:gap-4 sm:px-5 sm:py-5 ${TONE_SURFACE[tone]} ${glow ?? ''} ${
        tone === 'danger' ? 'animate-banner-in-danger' : 'animate-banner-in'
      }`}
    >
      <span
        className={`animate-icon-pop flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${ICON_CHIP[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-[1.0625rem] leading-tight font-bold sm:text-lg">
          {title}
        </p>
        <p className="mt-1 text-sm" style={{ color: BODY_COLOR[tone] }}>
          {children}
        </p>
        {tags && tags.length > 0 && (
          /* Gli allergeni come chip invece che in una riga separata da
             virgole: si contano a colpo d'occhio e ognuno resta leggibile
             anche quando sono tre o quattro. */
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const emoji = emojiForTag(tag)
              return (
                <li
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full bg-bg/55 px-2.5 py-1 text-xs font-semibold"
                  style={{ color: BODY_COLOR[tone] }}
                >
                  {emoji && <span aria-hidden>{emoji}</span>}
                  {labelForTag(tag, lang)}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
