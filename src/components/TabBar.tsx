import { NavLink } from 'react-router-dom'
import {
  HistoryIcon,
  ProfileIcon,
  ScanIcon,
  SearchIcon,
  SettingsIcon,
} from './Icons'

const TABS = [
  { to: '/', label: 'Cerca', Icon: SearchIcon },
  { to: '/scan', label: 'Scan', Icon: ScanIcon },
  { to: '/history', label: 'Storico', Icon: HistoryIcon },
  { to: '/profile', label: 'Profilo', Icon: ProfileIcon },
  { to: '/settings', label: 'Altro', Icon: SettingsIcon },
]

export default function TabBar() {
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
        {TABS.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1 md:flex-none">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex h-full flex-col items-center justify-center gap-1 text-[0.65rem] font-medium transition-colors md:h-16 ${
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
