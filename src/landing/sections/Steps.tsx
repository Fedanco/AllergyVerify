import type { ReactNode } from 'react'
import type { LandingDict } from '../i18n'
import Torn from '../art/Torn'
import Stamp from '../art/Stamp'
import { BarcodeIcon, ReadIcon, TilesIcon } from '../art/Icons'
import Sheet from '../art/Sheet'

interface StepsProps {
  t: LandingDict
}

const TONES = ['blue', 'red', 'green'] as const
const ICONS: ((cls: string) => ReactNode)[] = [
  (cls) => <BarcodeIcon className={cls} />,
  (cls) => <TilesIcon className={cls} />,
  (cls) => <ReadIcon className={cls} />,
]

/**
 * I tre passi come tre cartellini timbrati, più un biglietto "installa" su
 * carta gialla. Niente righe blu a incorniciarli (c'erano, riprese dal mock,
 * e sono state tolte): timbro e cartellino bastano a dare ordine e
 * sequenza, e il resto della pagina è fatto di oggetti di carta appoggiati
 * sul foglio, senza cornici.
 */
export default function Steps({ t }: StepsProps) {
  return (
    <Sheet id="come-funziona" seed={71}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <h2 className="font-hand text-[clamp(2rem,4.6vw,3.1rem)] leading-[1.08]">{t.how.title}</h2>
        <p className="mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-ink-soft sm:text-[1.05rem]">
          {t.how.body}
        </p>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((step, i) => (
            <div key={step.stamp}>
              <Stamp tone={TONES[i]} tilt={i % 2 ? 1.2 : -1.5}>
                {step.stamp}
              </Stamp>
              <Torn seed={20 + i} amp={5} className="mt-4 p-4 sm:p-5">
                {ICONS[i]('h-12 w-12')}
                <h3 className="mt-3 font-hand text-[1.3rem] leading-tight">{step.title}</h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-soft">{step.body}</p>
              </Torn>
            </div>
          ))}

          <div>
            <Stamp tone="blue" tilt={1.5}>
              {t.install.stamp}
            </Stamp>
            <Torn seed={27} amp={5} bg="var(--color-wheat-tint)" className="mt-4 rotate-[0.8deg] p-4 sm:p-5">
              <h3 className="font-hand text-[1.3rem] leading-tight">{t.install.title}</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-soft">{t.install.body}</p>
              <ul className="mt-3 space-y-2 text-[0.85rem] leading-snug">
                {[t.install.ios, t.install.android].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.45em] h-2.5 w-2.5 shrink-0 rounded-full bg-blue"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Torn>
          </div>
        </div>
      </div>
    </Sheet>
  )
}
