import { checkAllergens, emojiForTag, labelForTag } from '../data/allergenCatalog'
import { useLang } from '../i18n/useLang'
import type { Translations } from '../i18n/translations'
import { TONE_DOT, TONE_STAMP, TONE_TINT, type Tone } from '../lib/allergyTone'
import Stamp from '../paper/Stamp'
import Torn from '../paper/Torn'
import type { AllergyProfile, Product } from '../types/product'
import { InfoIcon } from './Icons'

interface Props {
  product: Product
  /** profili attivi: uno solo nel caso normale, più d'uno in modalità famiglia */
  profiles: AllergyProfile[]
}

/**
 * Verdetto allergie: l'oggetto principale della pagina prodotto, un
 * cartellino di carta strappata con il timbro del verdetto.
 * - rosso CONTIENE: almeno un allergene del profilo attivo e' presente
 * - grano TRACCE: nessun allergene diretto ma tracce ("può contenere")
 * - verde OK: nessun allergene del profilo rilevato
 * - neutro, senza timbro: nessun profilo attivo o dati allergeni mancanti
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
      <Pill tone="neutral" title={t.allergyBanner.noProfileTitle}>
        {t.allergyBanner.noProfileBody}
      </Pill>
    )
  }

  const { detected, traces, hasData } = checkAllergens(product, profile.allergens)

  if (!hasData) {
    return (
      <Pill tone="neutral" title={t.allergyBanner.noDataTitle}>
        {t.allergyBanner.noDataBody}
      </Pill>
    )
  }

  if (detected.length > 0) {
    return (
      <>
        <Pill tone="danger" title={t.allergyBanner.dangerTitle(profile.name)} tags={detected}>
          {t.allergyBanner.containsLabel}
        </Pill>
        {traces.length > 0 && <TracesPill traces={traces} />}
      </>
    )
  }

  if (traces.length > 0) {
    return (
      <>
        <Pill tone="safe" title={t.allergyBanner.safeWithTracesTitle}>
          {t.allergyBanner.safeWithTracesBody}
        </Pill>
        <TracesPill traces={traces} />
      </>
    )
  }

  return (
    <Pill tone="safe" title={t.allergyBanner.safeTitle}>
      {t.allergyBanner.safeBody(profile.name)}
    </Pill>
  )
}

/** Parola del timbro per un tono (il neutro non ha timbro). */
function stampLabel(t: Translations, tone: Tone): string {
  return tone === 'danger'
    ? t.allergyBanner.stamp.contains
    : tone === 'warn'
      ? t.allergyBanner.stamp.traces
      : t.allergyBanner.stamp.ok
}

/**
 * Verdetto con più profili attivi: una riga per persona, ciascuna sulla
 * propria tinta di carta con il proprio timbro a destra (come il mockup
 * della landing). Non c'è una scatola unica del colore del caso peggiore —
 * con due o tre persone la domanda vera non è "c'è un allergene?" ma "per
 * chi?", e il verde di chi può mangiarlo si vede prima di leggere il nome.
 * Sopra le righe resta una riga di sintesi col pallino del caso peggiore,
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
  // Qui le righe direbbero "nessun allergene" per tutti, che è falso.
  if (results.every((r) => !r.hasData)) {
    return (
      <Pill tone="neutral" title={t.allergyBanner.noDataTitle}>
        {t.allergyBanner.noDataBody}
      </Pill>
    )
  }

  const rows = results.map(({ profile, detected, traces }) => {
    const tone: Tone = detected.length > 0 ? 'danger' : traces.length > 0 ? 'warn' : 'safe'
    return { profile, tone, tags: detected.length > 0 ? detected : traces }
  })

  const hit = rows.filter((c) => c.tone === 'danger').length
  const withTraces = rows.filter((c) => c.tone === 'warn').length
  const worst: Tone = hit > 0 ? 'danger' : withTraces > 0 ? 'warn' : 'safe'
  const summary =
    worst === 'danger'
      ? t.allergyBanner.multiSummaryDanger(hit, profiles.length)
      : worst === 'warn'
        ? t.allergyBanner.multiSummaryTraces(withTraces, profiles.length)
        : t.allergyBanner.multiSummarySafe(profiles.length)

  return (
    <div role="status" aria-live="polite" className="animate-banner-in flex flex-col gap-2.5">
      <p className="flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.06em] uppercase">
        <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-full ${TONE_DOT[worst]}`} />
        {summary}
      </p>
      <ul className="flex flex-col gap-2">
        {rows.map(({ profile, tone, tags }, i) => (
          /* L'animazione sta sul <li>, la rotazione sul foglietto dentro:
             `step-in` anima `transform` e col fill-mode `both` cancellerebbe
             la rotazione inline. Rotazioni alternate di ±0,4°: fogliettini
             appoggiati sul cartellino, non righe di una tabella. */
          <li
            key={profile.id}
            style={{ '--i': Math.min(i, 8) } as React.CSSProperties}
            className="animate-step-in [animation-delay:calc(var(--i)*60ms)]"
          >
            <div
              style={{ background: TONE_TINT[tone], transform: `rotate(${i % 2 ? 0.4 : -0.4}deg)` }}
              className="flex items-center justify-between gap-3 rounded-[3px] px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm leading-tight font-bold">{profile.name}</p>
                <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-soft">
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
              </div>
              <Stamp tone={TONE_STAMP[tone] ?? 'green'} tilt={i % 2 ? 2 : -2} className="shrink-0 text-[0.65rem]">
                {stampLabel(t, tone)}
              </Stamp>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TracesPill({ traces }: { traces: string[] }) {
  const { t } = useLang()
  return (
    <Pill tone="warn" title={t.allergyBanner.tracesTitle} tags={traces} seed={42}>
      {t.allergyBanner.mayContainLabel}
    </Pill>
  )
}

/**
 * Cartellino del verdetto a profilo singolo: carta strappata nella tinta
 * del tono, testo in inchiostro, timbro a destra che si "schiaffa" sopra
 * dopo il cartellino. L'animazione d'ingresso sta sul wrapper e quella del
 * timbro su uno span: mai un transform animato sull'elemento filtrato
 * (`torn` ha un drop-shadow) né sul timbro, che è già ruotato.
 */
function Pill({
  tone,
  title,
  children,
  tags,
  seed = 41,
}: {
  tone: Tone
  title: string
  children: React.ReactNode
  /** allergeni da elencare come etichette sotto il titolo (tag normalizzati) */
  tags?: string[]
  /** seme dello strappo: due cartellini uno sopra l'altro non devono essere uguali */
  seed?: number
}) {
  const { lang, t } = useLang()
  const stampTone = TONE_STAMP[tone]
  return (
    <div role="status" aria-live="polite" className="animate-banner-in">
      <Torn
        seed={seed}
        amp={6}
        teeth={16}
        bg={TONE_TINT[tone]}
        className="flex items-start justify-between gap-3 p-4 sm:p-5"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[1.0625rem] leading-tight font-bold sm:text-lg">{title}</p>
          <p className="mt-1 text-sm text-ink-soft">{children}</p>
          {tags && tags.length > 0 && (
            /* Gli allergeni come etichette invece che in una riga separata
               da virgole: si contano a colpo d'occhio e ognuno resta
               leggibile anche quando sono tre o quattro. */
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const emoji = emojiForTag(tag)
                return (
                  <li
                    key={tag}
                    className="flex items-center gap-1.5 rounded-[3px] bg-paper-2 px-2 py-0.5 text-xs font-bold"
                  >
                    {emoji && <span aria-hidden>{emoji}</span>}
                    {labelForTag(tag, lang)}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        {stampTone ? (
          <span className="animate-slap inline-block shrink-0 [animation-delay:140ms]">
            <Stamp tone={stampTone} tilt={-3} className="text-[0.8rem] sm:text-sm">
              {stampLabel(t, tone)}
            </Stamp>
          </span>
        ) : (
          <InfoIcon className="h-6 w-6 shrink-0 text-ink-soft" />
        )}
      </Torn>
    </div>
  )
}
