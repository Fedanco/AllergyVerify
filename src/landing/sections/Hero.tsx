import type { LandingDict } from '../i18n'
import Torn from '../../paper/Torn'
import Underline from '../art/Underline'
import { Rays, Scribble } from '../art/Crayon'

interface HeroProps {
  t: LandingDict
}

export default function Hero({ t }: HeroProps) {
  return (
    <section
      id="top"
      data-inview="true"
      className="mx-auto grid w-full max-w-6xl items-center gap-10 overflow-x-clip px-5 pb-16 pt-10 sm:px-8 md:grid-cols-[7fr_5fr] md:gap-6 md:pb-24 md:pt-16"
    >
      <div>
        <h1 className="font-hand text-[clamp(2.6rem,6.5vw,4.25rem)] leading-[1.04]">
          <span className="block animate-rise">{t.hero.line1}</span>
          <span className="block animate-rise [animation-delay:90ms]">
            {t.hero.line2Lead}{' '}
            <Underline color="red" delay={620}>
              {t.hero.line2Mark}
            </Underline>
          </span>
        </h1>
        <p className="mt-7 max-w-[50ch] animate-rise text-[1.05rem] leading-relaxed text-ink-soft [animation-delay:180ms] sm:text-lg">
          {t.hero.body}
        </p>
        <div className="mt-9 flex animate-rise flex-wrap gap-4 [animation-delay:260ms]">
          <Torn
            as="a"
            href="/app/"
            seed={11}
            amp={5}
            bg="var(--color-blue)"
            className="lift focus-ring inline-block px-7 py-4 text-sm font-bold uppercase tracking-[0.1em] text-white"
          >
            {t.hero.cta}
          </Torn>
          <a
            href="#verdetto"
            className="lift focus-ring inline-flex items-center rounded-[5px] border-[3px] border-blue bg-paper-2 px-7 py-4 text-sm font-bold uppercase tracking-[0.1em] text-blue"
          >
            {t.hero.example}
          </a>
        </div>
      </div>

      {/* L'adesivo: il logo intero, tale e quale, incollato storto sulla carta */}
      <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[26rem] md:max-w-none">
        <Scribble className="absolute inset-x-[-8%] bottom-[4%] h-[36%] w-[116%]" />
        <Rays className="absolute inset-0 h-full w-full" />
        {/* L'animazione sta sul wrapper (livello proprio), il drop-shadow
            sull'immagine: così l'ombra si calcola una volta sola invece che a
            ogni frame dello scale. */}
        <div className="absolute left-1/2 top-[47%] w-[56%] -translate-x-1/2 -translate-y-1/2 -rotate-[4deg]">
          <div className="animate-slap will-change-transform [animation-delay:220ms]">
            <img
              src="/logo-hero-v1.webp"
              alt={t.hero.logoAlt}
              width={802}
              height={840}
              fetchPriority="high"
              className="block w-full drop-shadow-[2px_6px_0_rgba(22,22,22,0.1)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
