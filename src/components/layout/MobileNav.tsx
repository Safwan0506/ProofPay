import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function MobileNav() {
  const { signOut } = useAuth()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-800/95 backdrop-blur-lg border-t border-navy-600/30">
      <div className="flex items-center justify-around py-2">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-xs ${
              isActive ? 'text-gold-400' : 'text-navy-400'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/dashboard/orders"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-xs ${
              isActive ? 'text-gold-400' : 'text-navy-400'
            }`
          }
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Commandes</span>
        </NavLink>
        <button
          onClick={signOut}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-xs text-navy-400"
        >
          <LogOut className="w-5 h-5" />
          <span>Sortir</span>
        </button>
      </div>
    </nav>
  )
}
