import { NavLink } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
import LogoTile from './LogoTile'
import {
  HistoryIcon,
  ProfileIcon,
  ScanIcon,
  SearchIcon,
  SettingsIcon,
} from './Icons'

export default function TabBar() {
  const { t } = useLang()

  const tabs = [
    { to: '/', label: t.tabs.search, Icon: SearchIcon },
    { to: '/scan', label: t.tabs.scan, Icon: ScanIcon },
    { to: '/history', label: t.tabs.history, Icon: HistoryIcon },
    { to: '/profile', label: t.tabs.profile, Icon: ProfileIcon },
    { to: '/settings', label: t.tabs.settings, Icon: SettingsIcon },
  ]

  return (
    <nav
      aria-label={t.app.mainNavAria}
      /* Dock che galleggia sopra il contenuto invece di una striscia
         attaccata al bordo. La safe area iOS entra nell'offset `bottom`, non
         in un padding interno: sommare i due farebbe scendere la dock sotto
         la home indicator. Gli altri due punti che devono restare d'accordo
         sono in App.tsx (padding di fondo della shell e velo della status
         bar). */
      className="clay-dock fixed inset-x-3 z-40 rounded-[1.75rem]
        md:inset-x-auto md:top-3 md:bottom-3 md:left-3 md:w-20"
      style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      {/* La visibilità sta sul wrapper, non su LogoTile: quel componente
          porta gia' `inline-flex`, e due utility di display sullo stesso
          elemento litigano (vinceva `inline-flex`, quindi su mobile il logo
          restava visibile sopra l'icona Storico). */}
      <div className="absolute top-5 left-1/2 hidden -translate-x-1/2 md:block">
        <LogoTile className="h-10 w-10" />
      </div>
      <ul className="flex h-16 items-stretch justify-around md:h-full md:flex-col md:justify-center md:gap-2">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1 md:flex-none">
            <NavLink
              to={to}
              className="focus-ring group flex h-full flex-col items-center justify-center gap-1 text-[0.65rem] font-medium md:h-16"
            >
              {({ isActive }) => (
                <>
                  {/* Il tab attivo è un disco a colore pieno, non una
                      velatura del 15%: su questa superficie la tinta
                      trasparente si leggeva appena. */}
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-[background-color,color] duration-[var(--duration-fast)] ${
                      isActive ? 'bg-accent text-bg' : 'text-ink-dim group-hover:text-ink'
                    }`}
                  >
                    <Icon className="h-5 w-5" filled={isActive} />
                  </span>
                  <span
                    className={`transition-colors duration-[var(--duration-fast)] ${
                      isActive ? 'text-accent' : 'text-ink-dim group-hover:text-ink'
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
