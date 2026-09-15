import type { LandingDict, Tone } from '../i18n'
import Torn from '../../paper/Torn'
import Stamp from '../../paper/Stamp'
import Underline from './Underline'
import { useInView } from '../useInView'

interface PhoneMockupProps {
  mock: LandingDict['verdict']['mock']
}

const TILE_BG: Record<Tone, string> = {
  red: 'var(--color-red-tint)',
  wheat: 'var(--color-wheat-tint)',
  green: 'var(--color-green-tint)',
}

const DOT: Record<Tone, string> = {
  red: 'bg-red',
  wheat: 'bg-wheat',
  green: 'bg-green',
}

/**
 * La schermata del verdetto, ridisegnata su carta: una tessera per persona
 * col suo timbro, poi la lista ingredienti con gli allergeni sottolineati a
 * pennarello. Le sottolineature si disegnano quando il foglio entra in vista.
 */
export default function PhoneMockup({ mock }: PhoneMockupProps) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4)
  const worst = mock.people[0].tone
  let markIndex = 0

  return (
    <div ref={ref} data-inview={inView ? 'true' : 'false'} className="mx-auto w-full max-w-[22rem] rotate-[1.5deg]">
      <Torn seed={31} amp={6} teeth={16} className="p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <img src="/logo-v2.png" alt="" width={248} height={260} className="h-6 w-auto" />
          <span className="font-hand text-sm leading-none">AllergyVerify</span>
        </div>

        <p className="mt-4 font-hand text-[1.35rem] leading-tight">{mock.product}</p>
        <p className="mt-1 text-[0.7rem] tracking-[0.12em] text-ink-soft">{mock.barcode}</p>

        <p className="mt-4 flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.06em]">
          <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${DOT[worst]}`} />
          {mock.summary}
        </p>

        <ul className="mt-2.5 space-y-2">
          {mock.people.map((p, i) => (
            <li
              key={p.name}
              className="flex items-center justify-between gap-3 px-3 py-2.5"
              style={{ background: TILE_BG[p.tone], transform: `rotate(${i % 2 ? 0.4 : -0.4}deg)` }}
            >
              <div className="min-w-0">
                <p className="text-[0.85rem] font-bold leading-tight">{p.name}</p>
                <p className="mt-0.5 truncate text-[0.75rem] text-ink-soft">{p.detail}</p>
              </div>
              <Stamp tone={p.tone} tilt={i % 2 ? 2 : -2} className="shrink-0 text-[0.65rem]">
                {p.stamp}
              </Stamp>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-soft">{mock.ingredientsTitle}</p>
        <p className="mt-1.5 text-[0.78rem] leading-relaxed">
          {mock.ingredients.map((seg, i) =>
            seg.mark ? (
              <Underline key={i} color={seg.mark} delay={250 + 350 * markIndex++}>
                <span className="font-bold">{seg.text}</span>
              </Underline>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </p>
      </Torn>
    </div>
  )
}
