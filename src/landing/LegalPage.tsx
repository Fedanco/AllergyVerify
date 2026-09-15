import type { ReactNode } from 'react'
import type { Lang } from '../i18n/langStore'
import { legal } from '../i18n/legal'
import Torn from './art/Torn'
import Stamp from './art/Stamp'

const LINK = 'focus-ring font-bold text-blue underline underline-offset-4'

interface LegalPageProps {
  kind: 'privacy' | 'terms'
  lang: Lang
  /** Etichetta del timbro rosso sopra le sezioni importanti dei Termini. */
  warningLabel: string
}

/**
 * Privacy e Termini nella veste della landing: un foglio di carta con le
 * sezioni una sotto l'altra. I testi sono gli stessi dell'app (`legal.ts`),
 * così restano allineati; cambia solo la carta su cui sono stampati.
 */
export default function LegalPage({ kind, lang, warningLabel }: LegalPageProps) {
  const d = legal[lang]
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-10 sm:px-8 md:pb-28 md:pt-14">
      {kind === 'privacy' ? <Privacy d={d.privacy} /> : <Terms d={d.terms} warningLabel={warningLabel} />}
    </main>
  )
}

function Sheet({ title, updated, intro, children }: { title: string; updated: string; intro: string; children: ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-[42rem]">
        <h1 className="font-hand text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.08]">{title}</h1>
        <p className="mt-3 text-[0.8rem] font-bold uppercase tracking-[0.08em] text-ink-soft">{updated}</p>
        <p className="mt-5 max-w-[60ch] text-[1rem] leading-relaxed text-ink-soft sm:text-[1.05rem]">{intro}</p>
      </div>
      <Torn seed={61} amp={7} teeth={20} className="mx-auto mt-10 max-w-[42rem] -rotate-[0.3deg] p-6 sm:p-10">
        <div className="flex flex-col gap-8">{children}</div>
      </Torn>
    </>
  )
}

function Section({ title, highlight = false, children }: { title: string; highlight?: boolean; children: ReactNode }) {
  return (
    <section className={highlight ? '-mx-3 bg-wheat-tint px-3 py-3 sm:-mx-4 sm:px-4' : ''}>
      <h2 className="text-[0.95rem] font-bold">{title}</h2>
      <div className="mt-2 max-w-[65ch] text-[0.9rem] leading-relaxed text-ink-soft">{children}</div>
    </section>
  )
}

function Privacy({ d }: { d: (typeof legal)['it']['privacy'] }) {
  return (
    <Sheet title={d.title} updated={d.updated} intro={d.intro}>
      <Section title={d.controllerTitle}>
        <p>{d.controllerBody}</p>
      </Section>
      <Section title={d.dataTitle}>
        <p>{d.dataBody}</p>
      </Section>
      <Section title={d.thirdPartiesTitle}>
        <p>{d.thirdPartiesIntro}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {d.thirdParties.map((tp) => (
            <li key={tp.name} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.5em] h-2.5 w-2.5 shrink-0 rounded-full bg-blue" />
              <span>
                <span className="font-bold text-ink">{tp.name}</span> — {tp.body}
              </span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title={d.cookiesTitle}>
        <p>{d.cookiesBody}</p>
      </Section>
      <Section title={d.rightsTitle}>
        <p>{d.rightsBody}</p>
      </Section>
      <Section title={d.githubTitle}>
        <p>{d.githubBody}</p>
        <p className="mt-2">
          {d.contactLead}
          <a href={`mailto:${d.contactEmail}`} className={LINK}>
            {d.contactEmail}
          </a>
          .
        </p>
      </Section>
    </Sheet>
  )
}

function Terms({ d, warningLabel }: { d: (typeof legal)['it']['terms']; warningLabel: string }) {
  return (
    <Sheet title={d.title} updated={d.updated} intro={d.intro}>
      <Section title={d.purposeTitle}>
        <p>{d.purposeBody}</p>
      </Section>
      {/* Le tre sezioni che contano davvero (nessuna garanzia, non è un
          consiglio medico, responsabilità) stanno su carta evidenziata. */}
      <div>
        <Stamp tone="red" tilt={-2}>
          {warningLabel}
        </Stamp>
      </div>
      <Section title={d.accuracyTitle} highlight>
        <p>{d.accuracyBody}</p>
      </Section>
      <Section title={d.medicalTitle} highlight>
        <p>{d.medicalBody}</p>
      </Section>
      <Section title={d.liabilityTitle} highlight>
        <p>{d.liabilityBody}</p>
      </Section>
      <Section title={d.licenseTitle}>
        <p>{d.licenseBody}</p>
      </Section>
      <Section title={d.changesTitle}>
        <p>{d.changesBody}</p>
      </Section>
    </Sheet>
  )
}
