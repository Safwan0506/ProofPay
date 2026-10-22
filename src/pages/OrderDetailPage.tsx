import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useReceipts } from '@/hooks/useReceipts'
import ReceiptUpload from '@/components/receipts/ReceiptUpload'
import ReceiptsList from '@/components/receipts/ReceiptsList'
import type { Order } from '@/types/database'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { receipts, fetchReceipts } = useReceipts(id)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        toast.error('Commande non trouvée')
        navigate('/orders')
        return
      }

      setOrder(data as Order)
      await fetchReceipts(id)
      setLoading(false)
    }

    fetchOrder()
  }, [id, navigate, fetchReceipts])

  const statusConfig = {
    en_attente: { icon: Clock, color: 'yellow', label: 'En attente' },
    a_verifier: { icon: AlertCircle, color: 'orange', label: 'À vérifier' },
    confirme: { icon: CheckCircle2, color: 'green', label: 'Confirmé' },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) return null

  const config = statusConfig[order.status as keyof typeof statusConfig]
  const Icon = config.icon
  const colorMap = { yellow: 'text-yellow-400', orange: 'text-orange-400', green: 'text-green-400' }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux commandes
      </button>

      <div className="bg-navy-800/50 border border-navy-600/30 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{order.order_code}</h1>
            <p className="text-navy-400 text-sm">{order.customer_name}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-${config.color}-500/10 border border-${config.color}-500/20`}>
            <Icon className={`w-4 h-4 ${colorMap[config.color as keyof typeof colorMap]}`} />
            <span className="font-semibold text-white text-sm">{config.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-navy-400 text-xs uppercase tracking-wider mb-1">Montant</p>
            <p className="text-lg font-bold text-white">{order.amount.toLocaleString()} {order.currency}</p>
          </div>
          <div>
            <p className="text-navy-400 text-xs uppercase tracking-wider mb-1">Paiement</p>
            <p className="text-sm text-white">{order.payment_method}</p>
          </div>
          <div>
            <p className="text-navy-400 text-xs uppercase tracking-wider mb-1">Contact</p>
            <p className="text-sm text-white break-all">{order.customer_contact}</p>
          </div>
          <div>
            <p className="text-navy-400 text-xs uppercase tracking-wider mb-1">Date</p>
            <p className="text-sm text-white">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReceiptUpload orderId={id!} onSuccess={() => fetchReceipts(id!)} />
          <div className="mt-6">
            <h2 className="text-xl font-bold text-white mb-4">Justificatifs attachés</h2>
            <ReceiptsList receipts={receipts} />
          </div>
        </div>

        <div className="bg-navy-800/50 border border-navy-600/30 rounded-xl p-6 h-fit">
          <h3 className="font-semibold text-white mb-4">Résumé</h3>
          <div className="space-y-3">
            <div>
              <p className="text-navy-400 text-xs uppercase tracking-wider mb-1">Justificatifs</p>
              <p className="text-2xl font-bold text-white">{receipts.length}</p>
            </div>
            <div className="pt-3 border-t border-navy-600/30">
              <p className="text-navy-400 text-xs uppercase tracking-wider mb-2">Anomalies</p>
              {receipts.filter(r => r.review_status === 'anomalie').length > 0 ? (
                <ul className="space-y-2">
                  {receipts
                    .filter(r => r.review_status === 'anomalie')
                    .map(r => (
                      <div key={r.id} className="text-xs text-red-400 flex gap-2">
                        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{r.note || 'À vérifier'}</span>
                      </div>
                    ))}
                </ul>
              ) : (
                <p className="text-navy-400 text-sm">Aucune</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
