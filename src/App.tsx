import { Suspense, lazy } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import TabBar from './components/TabBar'
import HistoryPage from './pages/HistoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProfilePage from './pages/ProfilePage'
import SearchPage from './pages/SearchPage'
import SettingsPage from './pages/SettingsPage'

// zxing pesa ~400 kB: caricato solo quando si apre lo scanner
const ScanPage = lazy(() => import('./pages/ScanPage'))

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-dvh bg-bg pb-20 md:pb-0 md:pl-20">
        <main className="mx-auto w-full max-w-2xl px-4 pt-6">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route
              path="/scan"
              element={
                <Suspense
                  fallback={
                    <p className="py-10 text-center text-sm text-ink-dim">
                      Caricamento scanner…
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
            <Route path="/product/:code" element={<ProductDetailPage />} />
          </Routes>
        </main>
        <TabBar />
      </div>
    </HashRouter>
  )
}
