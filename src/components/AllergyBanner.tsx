import { labelForTag, matchAllergens } from '../data/allergenCatalog'
import type { AllergyProfile } from '../types/product'
import { AlertIcon, CheckIcon, InfoIcon } from './Icons'

interface Props {
  allergensTags: string[] | undefined
  profile: AllergyProfile | null
}

/**
 * Badge/pill di verdetto allergie:
 * - rosso: almeno un allergene del profilo attivo e' presente
 * - verde neon: nessun allergene del profilo rilevato
 * - neutro: nessun profilo attivo o dati allergeni mancanti
 */
export default function AllergyBanner({ allergensTags, profile }: Props) {
  if (!profile) {
    return (
      <Pill tone="neutral" Icon={InfoIcon} title="Nessun profilo attivo">
        Crea un profilo allergie per il verdetto personalizzato.
      </Pill>
    )
  }

  if (!allergensTags) {
    return (
      <Pill tone="neutral" Icon={InfoIcon} title="Dati allergeni non disponibili">
        Il prodotto non riporta l'elenco allergeni: verifica l'etichetta.
      </Pill>
    )
  }

  const detected = matchAllergens(allergensTags, profile.allergens)

  if (detected.length > 0) {
    return (
      <Pill tone="danger" Icon={AlertIcon} title={`Attenzione, ${profile.name}!`}>
        Contiene: {detected.map(labelForTag).join(', ')}
      </Pill>
    )
  }

  return (
    <Pill tone="safe" Icon={CheckIcon} title="Nessun tuo allergene rilevato">
      Sicuro per il profilo "{profile.name}" secondo i dati disponibili.
    </Pill>
  )
}

const TONES = {
  danger: 'border-danger/40 bg-danger/10 text-danger',
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
