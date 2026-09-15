import { landingDict } from './i18n'
import Torn from '../paper/Torn'
import Underline from './art/Underline'
import { Rays, Scribble } from './art/Crayon'

/**
 * Anteprima social (Open Graph) a 1200×630: la si apre con `/?og` e la si
 * fotografa per produrre `public/og-v1.png`. Non è una pagina per gli utenti:
 * è sempre in inglese, come i meta tag, e non ha animazioni da aspettare.
 */
export default function OgCard() {
  const t = landingDict.en
  return (
    <div
      data-inview="true"
      className="relative flex h-[630px] w-[1200px] items-center gap-6 overflow-clip bg-paper px-16"
      style={{ animation: 'none' }}
    >
      <div className="w-[640px] shrink-0">
        <Torn seed={3} amp={5} className="inline-flex -rotate-1 items-center gap-3 px-4 py-2.5">
          <img src="/logo-v2.png" alt="" width={248} height={260} className="h-10 w-auto" />
          <span className="font-hand text-2xl leading-none">AllergyVerify</span>
        </Torn>
        <h1 className="mt-9 font-hand text-[4.6rem] leading-[1.04]">
          <span className="block">{t.hero.line1}</span>
          <span className="block">
            {t.hero.line2Lead}{' '}
            <Underline color="red" delay={0}>
              {t.hero.line2Mark}
            </Underline>
          </span>
        </h1>
        <p className="mt-7 max-w-[34ch] text-[1.35rem] leading-relaxed text-ink-soft">{t.hero.body}</p>
      </div>
      <div className="relative aspect-square w-[460px] shrink-0">
        <Scribble className="absolute inset-x-[-8%] bottom-[4%] h-[36%] w-[116%]" />
        <Rays className="absolute inset-0 h-full w-full" />
        <img
          src="/logo-hero-v1.webp"
          alt=""
          width={802}
          height={840}
          className="absolute left-1/2 top-[47%] w-[56%] -translate-x-1/2 -translate-y-1/2 -rotate-[4deg] drop-shadow-[2px_6px_0_rgba(22,22,22,0.1)]"
        />
      </div>
    </div>
  )
}
