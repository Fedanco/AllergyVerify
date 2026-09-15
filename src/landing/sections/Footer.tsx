import type { LandingDict } from '../i18n'
import Torn from '../art/Torn'
import Stamp from '../art/Stamp'

interface FooterProps {
  t: LandingDict
}

export default function Footer({ t }: FooterProps) {
  const links = [
    { href: '/privacy/', label: t.footer.privacy },
    { href: '/terms/', label: t.footer.terms },
    { href: 'https://github.com/Fedanco/AllergyVerify', label: t.footer.github, external: true },
  ]
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-12 pt-16 sm:px-8 md:pt-24">
      <Torn seed={52} amp={5} className="mx-auto flex max-w-[42rem] flex-col gap-3 rotate-[0.5deg] p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
        <Stamp tone="red" className="shrink-0 self-start">
          {t.warning.stamp}
        </Stamp>
        <p className="text-[0.85rem] leading-relaxed">{t.warning.body}</p>
      </Torn>

      <div className="mt-16 flex flex-wrap items-start justify-between gap-x-10 gap-y-6 border-t-[3px] border-blue pt-7 text-[0.85rem]">
        <div className="max-w-[40ch]">
          <p className="font-hand text-xl leading-none">AllergyVerify</p>
          <p className="mt-3 leading-relaxed text-ink-soft">{t.footer.data}</p>
          <p className="leading-relaxed text-ink-soft">{t.footer.made}</p>
        </div>
        <ul className="flex flex-col gap-2 text-[0.8rem] font-bold uppercase tracking-[0.08em] sm:flex-row sm:flex-wrap sm:gap-x-6">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="focus-ring relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:origin-left after:scale-x-0 after:bg-blue after:transition-transform after:duration-200 hover:after:scale-x-100"
                {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
