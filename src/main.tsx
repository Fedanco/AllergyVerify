import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Solo i subset latin/latin-ext (copre italiano e inglese, incl. accenti):
// evita di scaricare/precache-are cirillico, greco, vietnamita ecc.
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-ext-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-ext-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-ext-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-ext-700.css'
// Outfit: solo per i titoli (--font-display). Variabile, quindi un file
// solo copre tutti i pesi che servono.
import '@fontsource-variable/outfit/wght.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-ext-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-ext-500.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
