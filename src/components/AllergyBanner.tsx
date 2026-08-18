import { checkAllergens, emojiForTag, labelForTag } from '../data/allergenCatalog'
import { useLang } from '../i18n/useLang'
import { TONE_GLOW, TONE_SURFACE, type Tone } from '../lib/allergyTone'
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
 * Verdetto con più profili attivi. Il tono è quello del caso peggiore fra i
 * profili (se anche uno solo è a rischio, il verdetto è rosso), ma il corpo
 * elenca riga per riga chi è coinvolto e con quali allergeni.
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
  const hit = results.filter((r) => r.detected.length > 0)
  const withTraces = results.filter((r) => r.detected.length === 0 && r.traces.length > 0)

  if (hit.length > 0) {
    return (
      <>
        <Pill
          tone="danger"
          Icon={AlertIcon}
          title={t.allergyBanner.multiDangerTitle}
          /* Elenca TUTTI i profili scelti, compresi quelli a posto: sapere
             chi PUO' mangiare una cosa e' utile quanto sapere chi non puo',
             e cosi' questo blocco basta da solo (il riquadro che ripeteva le
             stesse righe piu' sotto e' stato tolto). */
          rows={results.map((r) => ({
            name: r.profile.name,
            tags: r.detected.length > 0 ? r.detected : r.traces,
            ok: r.detected.length === 0 && r.traces.length === 0,
          }))}
        >
          {t.allergyBanner.multiDangerBody(hit.length, profiles.length)}
        </Pill>
        {withTraces.length > 0 && (
          <Pill
            tone="warn"
            Icon={AlertIcon}
            title={t.allergyBanner.multiTracesTitle}
            rows={withTraces.map((r) => ({ name: r.profile.name, tags: r.traces }))}
          >
            {t.allergyBanner.mayContainLabel}
          </Pill>
        )}
      </>
    )
  }

  if (withTraces.length > 0) {
    return (
      <>
        <Pill tone="safe" Icon={CheckIcon} title={t.allergyBanner.safeWithTracesTitle}>
          {t.allergyBanner.safeWithTracesBody}
        </Pill>
        <Pill
          tone="warn"
          Icon={AlertIcon}
          title={t.allergyBanner.multiTracesTitle}
          rows={withTraces.map((r) => ({ name: r.profile.name, tags: r.traces }))}
        >
          {t.allergyBanner.mayContainLabel}
        </Pill>
      </>
    )
  }

  // Nessun dato allergeni per nessuno: non è un "sicuro", è un "non lo so".
  if (results.every((r) => !r.hasData)) {
    return (
      <Pill tone="neutral" Icon={InfoIcon} title={t.allergyBanner.noDataTitle}>
        {t.allergyBanner.noDataBody}
      </Pill>
    )
  }

  void lang
  return (
    <Pill tone="safe" Icon={CheckIcon} title={t.allergyBanner.multiSafeTitle}>
      {t.allergyBanner.multiSafeBody(profiles.length)}
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
  rows,
}: {
  tone: Tone
  Icon: (p: { className?: string }) => React.ReactNode
  title: string
  children: React.ReactNode
  /** allergeni da elencare come chip sotto il titolo (tag normalizzati) */
  tags?: string[]
  /** una riga per profilo coinvolto, con i suoi allergeni (modalità famiglia) */
  rows?: { name: string; tags: string[]; ok?: boolean }[]
}) {
  const { lang, t } = useLang()
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
        {rows && rows.length > 0 && (
          /* Una riga per persona, separate da un filo: dentro un blocco che
             e' gia' una superficie, incassare altri riquadri crea scatole
             dentro scatole. Il disco con l'iniziale porta il colore
             dell'esito, cosi' chi puo' e chi non puo' mangiare si distingue
             prima di leggere i nomi. */
          <ul className="mt-3 divide-y divide-black/25 border-t border-black/25">
            {rows.map((row) => (
              <li key={row.name} className="flex items-center gap-3 py-2.5">
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-bg"
                  style={{ background: row.ok ? 'var(--color-safe)' : `var(--color-${tone})` }}
                >
                  {row.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {row.name}
                  </span>
                  <span
                    className="block truncate text-xs"
                    style={{ color: row.ok ? 'var(--color-safe)' : BODY_COLOR[tone] }}
                  >
                    {row.ok
                      ? t.allergyBanner.multiRowSafe
                      : row.tags.map((tag) => labelForTag(tag, lang)).join(' · ')}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
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
