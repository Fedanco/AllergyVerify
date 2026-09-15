import type { CSSProperties } from 'react'
import type { Lang } from '../../i18n/langStore'
import type { LandingDict } from '../i18n'
import Torn from '../../paper/Torn'

interface NavProps {
  t: LandingDict
  lang: Lang
  setLang: (next: Lang) => void
}

const LANGS: Lang[] = ['it', 'en']

export default function Nav({ t, lang, setLang }: NavProps) {
  const links = [
    { href: '/#come-funziona', label: t.nav.how },
    { href: '/#verdetto', label: t.nav.verdict },
    { href: '/#dentro', label: t.nav.inside },
  ]
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
      <Torn
        as="a"
        href="/"
        seed={3}
        amp={5}
        className="lift focus-ring flex -rotate-1 items-center gap-2.5 px-3.5 py-2 sm:gap-3 sm:px-4 sm:py-2.5"
        style={{ '--lift-tilt': '-1deg' } as CSSProperties}
        aria-label="AllergyVerify"
      >
        <img src="/logo-v2.png" alt="" width={248} height={260} className="h-9 w-auto sm:h-10" />
        <span className="font-hand text-[1.35rem] leading-none sm:text-2xl">AllergyVerify</span>
      </Torn>

      <nav className="hidden items-center gap-7 text-[0.8rem] font-bold uppercase tracking-[0.08em] md:flex" aria-label="Sezioni">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="focus-ring relative py-1 text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:origin-left after:scale-x-0 after:bg-blue after:transition-transform after:duration-200 after:ease-[var(--ease-out-quart)] hover:after:scale-x-100"
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3 sm:gap-4">
        <div role="group" aria-label={t.nav.langLabel} className="flex items-center gap-1 text-[0.8rem] font-bold uppercase tracking-[0.08em]">
          {LANGS.map((code, i) => {
            const active = code === lang
            return (
              <span key={code} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="mx-1 text-ink-soft">/</span>}
                <button
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={active}
                  lang={code}
                  className={`focus-ring relative px-1 py-1 transition-colors ${
                    active
                      ? 'text-blue after:absolute after:inset-x-1 after:-bottom-0.5 after:h-[3px] after:bg-blue'
                      : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {code}
                </button>
              </span>
            )
          })}
        </div>
        <Torn
          as="a"
          href="/app/"
          seed={5}
          amp={4}
          bg="var(--color-blue)"
          className="lift focus-ring hidden px-4 py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.08em] text-white sm:inline-block"
        >
          {t.nav.open}
        </Torn>
      </div>
    </header>
  )
}
