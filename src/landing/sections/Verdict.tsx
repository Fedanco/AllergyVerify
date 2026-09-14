import type { LandingDict } from '../i18n'
import PhoneMockup from '../art/PhoneMockup'

interface VerdictProps {
  t: LandingDict
}

export default function Verdict({ t }: VerdictProps) {
  return (
    <section id="verdetto" className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-20 scroll-mt-4 sm:px-8 md:grid-cols-2 md:gap-10 md:py-28">
      <div className="md:pr-6">
        <h2 className="font-hand text-[clamp(2rem,4.6vw,3.1rem)] leading-[1.08]">{t.verdict.title}</h2>
        <p className="mt-6 max-w-[48ch] text-[1rem] leading-relaxed text-ink-soft sm:text-[1.05rem]">{t.verdict.body}</p>
      </div>
      <PhoneMockup mock={t.verdict.mock} />
    </section>
  )
}
