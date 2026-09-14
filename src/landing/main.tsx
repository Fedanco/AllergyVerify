import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Titolo a mano: un solo peso, solo latin. Il resto della pagina è in
// JetBrains Mono, già presente nel progetto per l'app.
import '@fontsource/permanent-marker/latin-400.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-ext-400.css'
import '@fontsource/jetbrains-mono/latin-700.css'
import '@fontsource/jetbrains-mono/latin-ext-700.css'
import './landing.css'
import Landing from './Landing.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Landing />
  </StrictMode>,
)
