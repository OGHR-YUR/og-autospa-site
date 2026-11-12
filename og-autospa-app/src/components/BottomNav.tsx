import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Home', icon: '⌂', end: true },
  { to: '/gallery', label: 'Gallery', icon: '▣' },
  { to: '/contact', label: 'Contact', icon: '✉' },
  { to: '/reviews', label: 'Reviews', icon: '★' },
] as const

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={'end' in tab ? tab.end : false}
          className={({ isActive }) => `bottom-nav__item${isActive ? ' is-active' : ''}`}
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span className="bottom-nav__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
