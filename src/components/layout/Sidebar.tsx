import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
  { to: '/dashboard/orders', icon: ShoppingBag, label: 'Commandes', end: false },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-navy-800 border-r border-navy-600/30">
      <div className="p-6 border-b border-navy-600/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-navy-900" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">ProofPay</h1>
            <p className="text-[10px] text-navy-400 uppercase tracking-widest">Contrôle des paiements</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-navy-300 hover:text-white hover:bg-navy-700/50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-navy-600/30">
        <div className="px-4 py-2 mb-3">
          <p className="text-xs text-navy-400 truncate">{user?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-navy-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
