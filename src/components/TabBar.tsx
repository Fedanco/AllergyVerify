import { NavLink } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-edge bg-surface/90 backdrop-blur-md
        md:inset-x-auto md:inset-y-0 md:left-0 md:w-20 md:border-t-0 md:border-r md:bg-surface"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <img
        src="./logo.png"
        alt="AllergyVerify"
        className="absolute top-5 left-1/2 hidden h-10 w-10 -translate-x-1/2 md:block"
      />
      <ul className="flex h-16 items-stretch justify-around md:h-full md:flex-col md:justify-center md:gap-2">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1 md:flex-none">
            <NavLink
              to={to}
              className="focus-ring group flex h-full flex-col items-center justify-center gap-1 text-[0.65rem] font-medium md:h-16"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-[background-color,color] duration-[var(--duration-fast)] ${
                      isActive ? 'bg-accent/15 text-accent' : 'text-ink-dim group-hover:text-ink'
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
