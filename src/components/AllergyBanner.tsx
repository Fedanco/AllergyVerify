import { checkAllergens, emojiForTag, labelForTag } from '../data/allergenCatalog'
import { useLang } from '../i18n/useLang'
import { TONE_GLOW, TONE_ICON, TONE_SURFACE, type Tone } from '../lib/allergyTone'
import type { AllergyProfile, Product } from '../types/product'
import { AlertIcon, CheckIcon, InfoIcon } from './Icons'

interface Props {
  product: Product
  /** profili attivi: uno solo nel caso normale, più d'uno in modalità famiglia */
  profiles: AllergyProfile[]
}

/**
 * Verdetto allergie: l'oggetto principale della pagina prodotto.
 * - rosso: almeno un allergene del profilo attivo e' presente
 * - arancio: nessun allergene diretto ma tracce ("può contenere") del profilo
 * - verde: nessun allergene del profilo rilevato
 * - neutro: nessun profilo attivo o dati allergeni mancanti
 */
export default function AllergyBanner({ product, profiles }: Props) {
  const { t } = useLang()

  // Con più profili attivi il verdetto deve dire per CHI c'è il problema:
  // sapere che "qualcuno" in famiglia non può mangiarlo non serve a nessuno.
  if (profiles.length > 1) {
    return <MultiVerdict product={product} profiles={profiles} />
  }

  const profile = profiles[0] ?? null

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

/**
 * Verdetto con più profili attivi: una tessera per persona, ciascuna col
 * proprio tono. Non c'è più una scatola unica del colore del caso peggiore —
 * con due o tre persone la domanda vera non è "c'è un allergene?" ma "per
 * chi?", e il verde di chi può mangiarlo si vede prima di leggere il nome.
 * Sopra le tessere resta una riga di sintesi col pallino del caso peggiore,
 * per chi guarda la pagina da lontano.
 */
function MultiVerdict({
  product,
  profiles,
}: {
  product: Product
  profiles: AllergyProfile[]
}) {
  const { lang, t } = useLang()

  const results = profiles.map((p) => ({
    profile: p,
    ...checkAllergens(product, p.allergens),
  }))

  // Nessun dato allergeni per nessuno: non è un "sicuro", è un "non lo so".
  // Qui le tessere direbbero "nessun allergene" per tutti, che è falso.
  if (results.every((r) => !r.hasData)) {
    return (
      <Pill tone="neutral" Icon={InfoIcon} title={t.allergyBanner.noDataTitle}>
        {t.allergyBanner.noDataBody}
      </Pill>
    )
  }

  const cards = results.map(({ profile, detected, traces }) => {
    const tone: Tone = detected.length > 0 ? 'danger' : traces.length > 0 ? 'warn' : 'safe'
    return { profile, tone, tags: detected.length > 0 ? detected : traces }
  })

  const hit = cards.filter((c) => c.tone === 'danger').length
  const withTraces = cards.filter((c) => c.tone === 'warn').length
  const worst: Tone = hit > 0 ? 'danger' : withTraces > 0 ? 'warn' : 'safe'
  const summary =
    worst === 'danger'
      ? t.allergyBanner.multiSummaryDanger(hit, profiles.length)
      : worst === 'warn'
        ? t.allergyBanner.multiSummaryTraces(withTraces, profiles.length)
        : t.allergyBanner.multiSummarySafe(profiles.length)

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-banner-in flex flex-col gap-2.5"
    >
      <p className="flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.12em] text-ink-dim uppercase">
        <span
          aria-hidden
          className={`h-2 w-2 shrink-0 rounded-full ${TONE_DOT[worst]}`}
        />
        {summary}
      </p>
      {/* auto-fit invece di un numero fisso di colonne: su telefono entrano
          due tessere, su schermo largo tutte in fila, senza breakpoint. */}
      <ul className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(10rem,1fr))]">
        {cards.map(({ profile, tone, tags }, i) => {
          const Icon = TONE_ICON[tone]
          return (
            <li
              key={profile.id}
              style={{ '--i': Math.min(i, 8) } as React.CSSProperties}
              className={`animate-step-in flex flex-col gap-2 rounded-card border p-3.5 [animation-delay:calc(var(--i)*60ms)] ${TONE_SURFACE[tone]}`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${ICON_CHIP[tone]}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <p className="min-w-0 flex-1 truncate font-display text-base font-semibold text-ink">
                  {profile.name}
                </p>
              </div>
              <p className="text-[0.8125rem] font-medium" style={{ color: BODY_COLOR[tone] }}>
                {tone === 'safe'
                  ? t.allergyBanner.multiRowSafe
                  : `${tone === 'danger' ? t.allergyBanner.containsLabel : t.allergyBanner.mayContainLabel} ${tags
                      .map((tag) => {
                        const emoji = emojiForTag(tag)
                        return emoji
                          ? `${emoji} ${labelForTag(tag, lang)}`
                          : labelForTag(tag, lang)
                      })
                      .join(' · ')}`}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
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

// Pallino della riga di sintesi multi-profilo: porta il tono del caso
// peggiore dove il testo è troppo piccolo per farlo da solo.
const TONE_DOT: Record<Tone, string> = {
  danger: 'bg-danger',
  warn: 'bg-warn',
  safe: 'bg-safe',
  neutral: 'bg-surface-3',
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
      <div className="min-w-0 flex-1">
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
