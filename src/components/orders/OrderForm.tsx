import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface OrderFormProps {
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export default function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    order_code: '',
    customer_name: '',
    customer_contact: '',
    amount: '',
    currency: 'XAF',
    payment_method: 'mobile_money',
    status: 'en_attente',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        ...form,
        amount: parseFloat(form.amount),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Code commande"
          required
          value={form.order_code}
          onChange={(e) => setForm({ ...form, order_code: e.target.value })}
          className="px-4 py-2 bg-navy-800 border border-navy-600/50 rounded-lg text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/50"
        />
        <input
          type="text"
          placeholder="Nom du client"
          required
          value={form.customer_name}
          onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          className="px-4 py-2 bg-navy-800 border border-navy-600/50 rounded-lg text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Contact (email, téléphone, etc.)"
          required
          value={form.customer_contact}
          onChange={(e) => setForm({ ...form, customer_contact: e.target.value })}
          className="px-4 py-2 bg-navy-800 border border-navy-600/50 rounded-lg text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/50"
        />
        <input
          type="number"
          placeholder="Montant"
          required
          min="0"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="px-4 py-2 bg-navy-800 border border-navy-600/50 rounded-lg text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={form.currency}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
          className="px-4 py-2 bg-navy-800 border border-navy-600/50 rounded-lg text-sm text-white focus:outline-none focus:border-gold-500/50"
        >
          <option value="XAF">FCFA (XAF)</option>
          <option value="USD">Dollar (USD)</option>
          <option value="EUR">Euro (EUR)</option>
        </select>

        <select
          value={form.payment_method}
          onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
          className="px-4 py-2 bg-navy-800 border border-navy-600/50 rounded-lg text-sm text-white focus:outline-none focus:border-gold-500/50"
        >
          <option value="mobile_money">Mobile Money</option>
          <option value="virement_bancaire">Virement bancaire</option>
          <option value="cheque">Chèque</option>
          <option value="carte">Carte bancaire</option>
          <option value="especes">Espèces</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold text-sm disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Créer la commande
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 bg-navy-700 text-white rounded-lg font-semibold text-sm hover:bg-navy-600 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
