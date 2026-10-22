import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Receipt } from '@/types/database'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_SIZE = 5 * 1024 * 1024

export function useReceipts(orderId?: string) {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(false)

  const fetchReceipts = useCallback(async (oid?: string) => {
    const targetId = oid ?? orderId
    if (!targetId) return

    setLoading(true)
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('order_id', targetId)
      .order('created_at', { ascending: false })

    if (error) throw error
    setReceipts(data ?? [])
    setLoading(false)
  }, [orderId])

  const uploadReceipt = async (
    oid: string,
    file: File,
    reference: string | null,
    amountSeen: number | null
  ) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Type de fichier non autorisé. Utilisez JPG, PNG, WEBP ou PDF.')
    }
    if (file.size > MAX_SIZE) {
      throw new Error('Fichier trop volumineux. Taille maximale : 5 Mo.')
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const ext = file.name.split('.').pop()
    const filePath = `${user.id}/${oid}/${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data, error } = await supabase
      .from('receipts')
      .insert({
        user_id: user.id,
        order_id: oid,
        file_path: filePath,
        file_name: file.name,
        reference,
        amount_seen: amountSeen,
        review_status: 'en_attente',
        note: null,
      })
      .select()
      .single()

    if (error) throw error
    setReceipts(prev => [data, ...prev])
    return data
  }

  const getFileUrl = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from('receipts')
      .createSignedUrl(filePath, 300)

    if (error) throw error
    return data.signedUrl
  }

  const checkDuplicateReference = async (reference: string, excludeId?: string) => {
    let query = supabase
      .from('receipts')
      .select('id, order_id')
      .eq('reference', reference)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query
    if (error) throw error
    return (data ?? []).length > 0
  }

  return { receipts, loading, fetchReceipts, uploadReceipt, getFileUrl, checkDuplicateReference }
}
