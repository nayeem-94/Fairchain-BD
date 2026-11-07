import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Home, Wheat, Ship, Factory, Layers, Warehouse, ArrowLeftRight, Receipt, Scale,
  Megaphone, CalendarClock, BarChart3, UserRound, LogOut, Menu, X,
} from 'lucide-react'
import Brand from './Brand.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { ROLES } from '../lib/format.js'

const I = {
  dash: { to: '/app', label: 'Dashboard', icon: Home, end: true },
  products: { to: '/app/products', label: 'Products', icon: Wheat },
  imports: { to: '/app/imports', label: 'Imports', icon: Ship },
  production: { to: '/app/productions', label: 'Production', icon: Factory },
  batches: { to: '/app/batches', label: 'Batches and trace', icon: Layers },
  inventory: { to: '/app/inventory', label: 'My stock', icon: Warehouse },
  transfers: { to: '/app/transfers', label: 'Transfers', icon: ArrowLeftRight },
  prices: { to: '/app/prices', label: 'Price records', icon: Receipt },
  check: { to: '/app/price-check', label: 'Price check', icon: Scale },
  fair: { to: '/app/reference-prices', label: 'Fair prices', icon: Scale },
  reports: { to: '/app/reports', label: 'Reports', icon: Megaphone },
  expiry: { to: '/app/expiry', label: 'Expiry alerts', icon: CalendarClock },
  analytics: { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
}

const SUPPLY_COMMON = [I.inventory, I.transfers, I.prices, I.check, I.batches, I.expiry]

export const NAV = {
  importer: [I.dash, I.imports, I.products, ...SUPPLY_COMMON],
  manufacturer: [I.dash, I.production, I.products, ...SUPPLY_COMMON],
  distributor: [I.dash, ...SUPPLY_COMMON],
  wholesaler: [I.dash, ...SUPPLY_COMMON],
  retailer: [I.dash, ...SUPPLY_COMMON],
  citizen: [I.dash, I.check, I.reports, I.fair, I.batches],
  admin: [I.dash, I.reports, I.transfers, I.prices, I.fair, I.expiry, I.analytics, I.batches, I.products],
}

function NavList({ items, onPick }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onPick}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md border-l-[3px] px-3 py-2 text-[15px] font-medium ${
              isActive ? 'border-paddy bg-paddy-tint text-paddy-dark' : 'border-transparent text-ink/80 hover:bg-paper'
            }`
          }
        >
          <Icon size={18} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const items = NAV[user.user_type] || [I.dash]

  const side = (
    <div className="flex h-full flex-col gap-5 p-4">
      <Brand />
      <div className="rounded-md border border-line bg-white px-3 py-2">
        <div className="truncate font-semibold">{user.username}</div>
        <div className="text-sm text-mute">{ROLES[user.user_type] || 'Account'}</div>
      </div>
      <NavList items={items} onPick={() => setOpen(false)} />
      <div className="mt-auto flex flex-col gap-0.5 border-t border-line pt-3">
        <NavLink to="/app/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-2 text-[15px] font-medium text-ink/80 hover:bg-paper">
          <UserRound size={18} /> Profile
        </NavLink>
        <button onClick={() => { logout(); nav('/') }} className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-[15px] font-medium text-ink/80 hover:bg-paper">
          <LogOut size={18} /> Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 hidden h-screen overflow-y-auto border-r border-line bg-panel lg:block">{side}</aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-panel px-4 py-2.5 lg:hidden">
        <Brand />
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded p-2 hover:bg-paper"><Menu size={22} /></button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] overflow-y-auto bg-panel shadow-2xl">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-3 rounded p-1.5 hover:bg-paper"><X size={20} /></button>
            {side}
          </div>
        </div>
      )}

      <main className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-[1080px]"><Outlet /></div>
      </main>
    </div>
  )
}
