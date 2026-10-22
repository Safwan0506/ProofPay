import { useState } from 'react'
import { Eye, AlertCircle, CheckCircle2, Clock, Download } from 'lucide-react'
import { useReceipts } from '@/hooks/useReceipts'
import type { Receipt } from '@/types/database'
import toast from 'react-hot-toast'

interface ReceiptsListProps {
  receipts: Receipt[]
}

export default function ReceiptsList({ receipts }: ReceiptsListProps) {
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { getFileUrl } = useReceipts()

  const handlePreview = async (receipt: Receipt) => {
    if (previewId === receipt.id) {
      setPreviewId(null)
      setPreviewUrl(null)
      return
    }

    setLoading(true)
    try {
      const url = await getFileUrl(receipt.file_path)
      setPreviewId(receipt.id)
      setPreviewUrl(url)
    } catch (err) {
      toast.error('Impossible de charger le fichier')
    } finally {
      setLoading(false)
    }
  }

  const statusConfig = {
    en_attente: { icon: Clock, color: 'yellow', label: 'En attente' },
    anomalie: { icon: AlertCircle, color: 'red', label: 'Anomalie' },
    valide: { icon: CheckCircle2, color: 'green', label: 'Valide' },
  }

  if (receipts.length === 0) {
    return (
      <div className="text-center py-8 text-navy-400">
        <p>Aucun justificatif attaché à cette commande</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {receipts.map((receipt) => {
        const config = statusConfig[receipt.review_status as keyof typeof statusConfig]
        const Icon = config.icon

        return (
          <div key={receipt.id} className="border border-navy-600/30 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-white truncate">{receipt.file_name}</p>
                  <Icon className={`w-4 h-4 text-${config.color}-400 flex-shrink-0`} />
                </div>
                <p className="text-navy-400 text-xs">
                  {new Date(receipt.created_at).toLocaleDateString('fr-FR')} à{' '}
                  {new Date(receipt.created_at).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePreview(receipt)}
                  disabled={loading}
                  className="p-2 hover:bg-navy-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Eye className="w-4 h-4 text-navy-400" />
                </button>
                <a
                  href={previewUrl || '#'}
                  download={receipt.file_name}
                  className="p-2 hover:bg-navy-700 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4 text-navy-400" />
                </a>
              </div>
            </div>

            {receipt.reference && (
              <div>
                <p className="text-navy-400 text-xs uppercase tracking-wider mb-1">Référence</p>
                <p className="text-white font-mono text-sm">{receipt.reference}</p>
              </div>
            )}

            {receipt.amount_seen && (
              <div>
                <p className="text-navy-400 text-xs uppercase tracking-wider mb-1">Montant affiché</p>
                <p className="text-white font-semibold">{receipt.amount_seen} XAF</p>
              </div>
            )}

            {receipt.note && (
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{receipt.note}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
