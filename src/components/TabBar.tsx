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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-edge bg-surface/90 backdrop-blur-md
        md:inset-x-auto md:inset-y-0 md:left-0 md:w-20 md:border-t-0 md:border-r md:bg-surface"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <img
        src="./logo.png"
        alt="AllergyScan"
        className="absolute top-5 left-1/2 hidden h-10 w-10 -translate-x-1/2 md:block"
      />
      <ul className="flex h-16 items-stretch justify-around md:h-full md:flex-col md:justify-center md:gap-2">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1 md:flex-none">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `focus-ring flex h-full flex-col items-center justify-center gap-1 text-[0.65rem] font-medium transition-colors md:h-16 ${
                  isActive ? 'text-accent' : 'text-ink-dim hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-6 w-6" filled={isActive} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
