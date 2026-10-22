import { useEffect, useState } from 'react'
import { BarChart3, AlertCircle, CheckCircle2, Clock, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Stats {
  total: number
  pending: number
  review: number
  confirmed: number
  confirmedAmount: number
  issues: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('status, amount')
          .eq('user_id', user.id)

        if (ordersError) throw ordersError

        const { data: receipts, error: receiptsError } = await supabase
          .from('receipts')
          .select('review_status, order_id')
          .eq('user_id', user.id)
          .eq('review_status', 'anomalie')

        if (receiptsError) throw receiptsError

        const total = orders?.length ?? 0
        const pending = orders?.filter(o => o.status === 'en_attente').length ?? 0
        const review = orders?.filter(o => o.status === 'a_verifier').length ?? 0
        const confirmed = orders?.filter(o => o.status === 'confirme').length ?? 0
        const confirmedAmount = orders
          ?.filter(o => o.status === 'confirme')
          .reduce((sum, o) => sum + (o.amount ?? 0), 0) ?? 0

        setStats({
          total,
          pending,
          review,
          confirmed,
          confirmedAmount,
          issues: receipts?.length ?? 0,
        })
      } catch (err) {
        console.error(err)
        toast.error('Erreur lors du chargement des statistiques')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total de commandes',
      value: stats?.total ?? 0,
      icon: BarChart3,
      color: 'blue',
    },
    {
      label: 'En attente',
      value: stats?.pending ?? 0,
      icon: Clock,
      color: 'yellow',
    },
    {
      label: 'À vérifier',
      value: stats?.review ?? 0,
      icon: AlertCircle,
      color: 'orange',
    },
    {
      label: 'Confirmées',
      value: stats?.confirmed ?? 0,
      icon: CheckCircle2,
      color: 'green',
    },
    {
      label: 'Montant confirmé',
      value: `${(stats?.confirmedAmount ?? 0).toLocaleString()} XAF`,
      icon: DollarSign,
      color: 'gold',
    },
    {
      label: 'Dossiers en anomalie',
      value: stats?.issues ?? 0,
      icon: AlertCircle,
      color: 'red',
    },
  ]

  const colorMap = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20 text-yellow-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/20 text-red-400',
    gold: 'from-gold-500/20 to-gold-600/10 border-gold-500/20 text-gold-400',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
        <p className="text-navy-400">Vue d'ensemble de vos commandes et justificatifs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          const colors = colorMap[card.color as keyof typeof colorMap]
          return (
            <div
              key={card.label}
              className={`p-6 rounded-xl border bg-gradient-to-br ${colors} backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-navy-300 text-sm font-medium mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                </div>
                <Icon className="w-6 h-6 opacity-60" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-navy-800/50 border border-navy-600/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white mb-2">À propos du contrôle</h3>
            <p className="text-navy-300 text-sm">
              ProofPay détecte les incohérences (montants différents, références dupliquées, justificatifs incomplets)
              mais ne confirme jamais automatiquement un paiement. Chaque confirmation nécessite une vérification
              humaine auprès de la source de paiement.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
