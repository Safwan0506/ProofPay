import { Link } from 'react-router-dom'
import { Clock, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react'
import type { Order } from '@/types/database'

interface OrdersListProps {
  orders: Order[]
}

export default function OrdersList({ orders }: OrdersListProps) {
  const statusConfig = {
    en_attente: { icon: Clock, color: 'yellow', label: 'En attente' },
    a_verifier: { icon: AlertCircle, color: 'orange', label: 'À vérifier' },
    confirme: { icon: CheckCircle2, color: 'green', label: 'Confirmé' },
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => {
        const config = statusConfig[order.status as keyof typeof statusConfig]
        const Icon = config.icon
        const bgColor = {
          yellow: 'bg-yellow-500/5 border-yellow-500/20',
          orange: 'bg-orange-500/5 border-orange-500/20',
          green: 'bg-green-500/5 border-green-500/20',
        }[config.color]

        return (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className={`flex items-center justify-between p-4 rounded-lg border ${bgColor} hover:border-gold-500/30 transition-all group`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-white truncate">{order.order_code}</h3>
                <Icon className={`w-4 h-4 text-${config.color}-400 flex-shrink-0`} />
              </div>
              <p className="text-navy-400 text-sm truncate">{order.customer_name}</p>
            </div>

            <div className="flex items-center justify-end gap-4 ml-4">
              <div className="text-right">
                <p className="font-semibold text-white">{order.amount.toLocaleString()} {order.currency}</p>
                <p className="text-navy-400 text-xs">{order.payment_method}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-navy-500 group-hover:text-gold-400 transition-colors flex-shrink-0" />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
