import { useRef, useState } from 'react'
import { Loader2, FileUp } from 'lucide-react'
import { useReceipts } from '@/hooks/useReceipts'
import toast from 'react-hot-toast'

interface ReceiptUploadProps {
  orderId: string
  onSuccess: () => void
}

export default function ReceiptUpload({ orderId, onSuccess }: ReceiptUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    reference: '',
    amountSeen: '',
  })
  const { uploadReceipt, checkDuplicateReference } = useReceipts()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)

    try {
      // Vérifier la référence si elle existe
      if (form.reference) {
        const isDuplicate = await checkDuplicateReference(form.reference)
        if (isDuplicate) {
          toast.error('Cette référence de transaction existe déjà dans votre espace')
          setLoading(false)
          return
        }
      }

      await uploadReceipt(
        orderId,
        file,
        form.reference || null,
        form.amountSeen ? parseFloat(form.amountSeen) : null
      )
      toast.success('Justificatif uploadé')
      setForm({ reference: '', amountSeen: '' })
      fileInputRef.current?.form?.reset()
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-navy-800/30 border border-navy-600/30 rounded-xl p-6">
      <h3 className="font-semibold text-white mb-4">Ajouter un justificatif</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Référence de transaction (optionnel)"
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            className="px-4 py-2 bg-navy-800 border border-navy-600/50 rounded-lg text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/50"
          />
          <input
            type="number"
            placeholder="Montant affiché (optionnel)"
            min="0"
            step="0.01"
            value={form.amountSeen}
            onChange={(e) => setForm({ ...form, amountSeen: e.target.value })}
            className="px-4 py-2 bg-navy-800 border border-navy-600/50 rounded-lg text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/50"
          />
        </div>

        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={handleFileSelect}
            disabled={loading}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-navy-600/50 rounded-lg text-navy-300 hover:border-gold-500/50 hover:text-gold-400 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <FileUp className="w-5 h-5" />
                <span>JPG, PNG, WEBP ou PDF (max 5 Mo)</span>
              </>
            )}
          </button>
        </div>

        <p className="text-navy-400 text-xs">
          Formats acceptés : JPG, PNG, WEBP, PDF. Taille maximale : 5 Mo.
        </p>
      </div>
    </div>
  )
}
