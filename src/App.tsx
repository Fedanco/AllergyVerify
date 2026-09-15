import { Suspense, lazy } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import TabBar from './components/TabBar'
import { useLang } from './i18n/useLang'
import HistoryPage from './pages/HistoryPage'
import PrivacyPage from './pages/PrivacyPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/SearchPage'
import SettingsPage from './pages/SettingsPage'
import TermsPage from './pages/TermsPage'

// zxing pesa ~400 kB: caricato solo quando si apre lo scanner
const ScanPage = lazy(() => import('./pages/ScanPage'))

export default function App() {
  const { t } = useLang()
  return (
    <HashRouter>
      {/* pb: la dock è alta 4rem e galleggia a 0.75rem dal fondo, piu' un
          respiro sotto l'ultimo elemento. Va tenuto d'accordo con l'offset
          `bottom` della dock in TabBar.tsx. Su md la dock diventa una colonna
          staccata a sinistra (0.75 + 5 + 0.75 rem). */}
      <div className="min-h-dvh bg-paper pt-[env(safe-area-inset-top)] pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-[6.5rem]">
        {/* in standalone iOS la pagina si estende sotto la status bar (viewport-fit=cover):
            questo velo evita che il contenuto scrollato si sovrapponga a orologio e notch.
            Con la status bar `default` (carta chiara, orologio nero) l'inset in alto
            vale 0 e il velo è alto zero: resta per chi avesse ancora la vecchia
            configurazione in cache. */}
        <div className="fixed inset-x-0 top-0 z-50 h-[env(safe-area-inset-top)] bg-paper/90 backdrop-blur-md md:hidden" />
        <main className="mx-auto w-full max-w-2xl px-4 pt-6 pb-8">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route
              path="/scan"
              element={
                <Suspense
                  fallback={
                    <p className="py-10 text-center text-sm text-ink-soft">
                      {t.app.loadingScanner}
                    </p>
                  }
                >
                  <ScanPage />
                </Suspense>
              }
            />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/product/:code" element={<ProductDetailPage />} />
          </Routes>
        </main>
        <TabBar />
        {/* Grana della carta: dopo la dock nel DOM, stesso z-index, quindi
            sopra tutto ciò che è persistente; trasparente ai click. La
            modale (z-50) le passa sopra. */}
        <div className="grain" aria-hidden="true" />
      </div>
    </HashRouter>
  )
}
