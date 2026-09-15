import { useEffect } from 'react'
import { useLangStore } from '../i18n/langStore'
import { landingDict } from './i18n'
import { CrayonDefs } from './art/Crayon'
import Nav from './sections/Nav'
import Hero from './sections/Hero'
import Steps from './sections/Steps'
import Verdict from './sections/Verdict'
import Inside from './sections/Inside'
import Footer from './sections/Footer'
import OgCard from './OgCard'
import LegalPage from '../paper/LegalPage'

// `/?og`: solo la card per l'anteprima social, da fotografare (vedi OgCard).
const OG_MODE = new URLSearchParams(window.location.search).has('og')

// /privacy/ e /terms/ sono entry HTML separate (stesso bundle): la pagina si
// sceglie dal path, senza router.
const PATH = window.location.pathname
const PAGE: 'home' | 'privacy' | 'terms' = PATH.startsWith('/privacy')
  ? 'privacy'
  : PATH.startsWith('/terms')
    ? 'terms'
    : 'home'

export default function Landing() {
  const { lang, setLang } = useLangStore()
  const t = landingDict[lang]

  useEffect(() => {
    document.title =
      PAGE === 'home'
        ? `AllergyVerify — ${t.hero.line1} ${t.hero.line2Lead} ${t.hero.line2Mark}`
        : `${PAGE === 'privacy' ? t.footer.privacy : t.footer.terms} — AllergyVerify`
  }, [t])

  if (OG_MODE) {
    return (
      <>
        <CrayonDefs />
        <OgCard />
      </>
    )
  }

  return (
    <>
      <CrayonDefs />
      <div className="grain" aria-hidden="true" />
      <Nav t={t} lang={lang} setLang={setLang} />
      {PAGE === 'home' ? (
        <main>
          <Hero t={t} />
          <Steps t={t} />
          <Verdict t={t} />
          <Inside t={t} />
        </main>
      ) : (
        <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-10 sm:px-8 md:pb-28 md:pt-14">
          <LegalPage kind={PAGE} lang={lang} warningLabel={t.warning.stamp} />
        </main>
      )}
      <Footer t={t} />
    </>
  )
}
