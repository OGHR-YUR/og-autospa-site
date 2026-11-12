import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { BrandMark } from './BrandMark'
import { BUSINESS } from '../data/config'

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar__brand">
          <BrandMark size={40} />
          <div>
            <strong>{BUSINESS.shortName}</strong>
            <span>Mobile detailing</span>
          </div>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
