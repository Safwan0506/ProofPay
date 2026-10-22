import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import OrderForm from '@/components/orders/OrderForm'
import OrdersList from '@/components/orders/OrdersList'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const [showForm, setShowForm] = useState(false)
  const { orders, loading, filters, setFilters, createOrder, refresh } = useOrders()

  useEffect(() => {
    // Force refresh au chargement
    refresh()
  }, [])

  const handleCreateOrder = async (data: any) => {
    try {
      await createOrder(data)
      toast.success('Commande créée avec succès')
      setShowForm(false)
      await refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la création')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Commandes</h1>
          <p className="text-navy-400">Gérez vos commandes et suivez les justificatifs</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nouvelle commande
        </button>
      </div>

      {showForm && (
        <div className="bg-navy-800/50 border border-navy-600/30 rounded-xl p-6">
          <OrderForm onSubmit={handleCreateOrder} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="bg-navy-800/30 border border-navy-600/30 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Rechercher par code ou client..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-navy-600/50 rounded-lg text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/50"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
          className="px-4 py-2 bg-navy-800 border border-navy-600/50 rounded-lg text-sm text-white focus:outline-none focus:border-gold-500/50"
        >
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="a_verifier">À vérifier</option>
          <option value="confirme">Confirmé</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length > 0 ? (
        <>
          <div className="text-sm text-gold-400 mb-4">
            {orders.length} commande(s) trouvée(s)
          </div>
          <OrdersList orders={orders} />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-navy-400">Aucune commande trouvée</p>
        </div>
      )}
    </div>
  )
}
