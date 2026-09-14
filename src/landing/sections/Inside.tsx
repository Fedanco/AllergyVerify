import type { LandingDict } from '../i18n'
import Torn from '../art/Torn'
import Stamp from '../art/Stamp'
import { BarcodeWide } from '../art/Icons'
import Sheet from '../art/Sheet'

interface InsideProps {
  t: LandingDict
}

/**
 * Le funzioni raccontate come un'etichetta alimentare: elenco ingredienti,
 * "non contiene", tabella dei valori, codice a barre. È la forma che l'app
 * insegna a leggere, quindi è anche la forma in cui si presenta.
 */
export default function Inside({ t }: InsideProps) {
  return (
    <Sheet id="dentro" seed={73}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="font-hand text-[clamp(2rem,4.6vw,3.1rem)] leading-[1.08]">{t.inside.title}</h2>
          <p className="mt-5 text-[1rem] leading-relaxed text-ink-soft sm:text-[1.05rem]">{t.inside.body}</p>
        </div>

        <Torn
          seed={44}
          amp={7}
          teeth={18}
          className="mx-auto mt-12 max-w-[42rem] -rotate-[0.6deg] p-6 sm:p-10"
        >
          <Stamp tone="blue">{t.inside.ingredientsStamp}</Stamp>
          <p className="mt-4 text-[0.95rem] leading-[1.75]">
            {t.inside.items.map((item, i) => (
              <span key={item.name}>
                <strong className="font-bold">{item.name}</strong>{' '}
                <span className="text-ink-soft">({item.note})</span>
                {i < t.inside.items.length - 1 ? ', ' : '.'}
              </span>
            ))}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Stamp tone="red" tilt={1.5}>
              {t.inside.withoutStamp}
            </Stamp>
            <p className="text-[0.95rem] font-bold">{t.inside.without}</p>
          </div>

          <h3 className="mt-9 border-b-[3px] border-ink pb-2 text-[0.8rem] font-bold uppercase tracking-[0.08em]">
            {t.inside.valuesTitle}
          </h3>
          <dl className="mt-2">
            {t.inside.values.map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline gap-3 border-b border-dotted border-ink-soft py-2 text-[0.9rem]"
              >
                <dt className="flex-1">{label}</dt>
                <dd className="font-bold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-[28ch] text-[0.75rem] leading-relaxed text-ink-soft">{t.inside.storage}</p>
            <div className="w-40">
              <BarcodeWide className="h-9 w-full" />
              <p className="mt-1 text-center text-[0.7rem] tracking-[0.18em]">8 001234 567890</p>
            </div>
          </div>
        </Torn>
      </div>
    </Sheet>
  )
}
