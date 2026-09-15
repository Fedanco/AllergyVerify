import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Gli stessi font della landing: JetBrains Mono per tutto il testo e
// Permanent Marker (un solo peso) per i titoli di pagina e il nome del
// prodotto. Solo i subset latin/latin-ext (italiano e inglese, accenti
// inclusi): evita di scaricare e precache-are cirillico, greco, vietnamita.
// Il peso 600 non c'è: `font-semibold` ripiega sul 700.
import '@fontsource/permanent-marker/latin-400.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-ext-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-ext-500.css'
import '@fontsource/jetbrains-mono/latin-700.css'
import '@fontsource/jetbrains-mono/latin-ext-700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
