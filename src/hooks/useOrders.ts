import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Order, OrderStatus } from '@/types/database'

interface OrderFilters {
  search: string
  status: OrderStatus | 'all'
  paymentMethod: string
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'all',
    paymentMethod: '',
  })

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    if (filters.paymentMethod) {
      query = query.eq('payment_method', filters.paymentMethod)
    }
    if (filters.search) {
      query = query.or(
        `customer_name.ilike.%${filters.search}%,order_code.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query
    if (error) throw error
    setOrders((data as Order[]) ?? [])
    setLoading(false)
  }, [filters])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const createOrder = async (order: Omit<Order, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Non authentifié')

    const { data, error } = await supabase
      .from('orders')
      .insert({ ...order, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    setOrders(prev => [data as Order, ...prev])
    return data
  }

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setOrders(prev => prev.map(o => o.id === id ? data as Order : o))
    return data
  }

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (error) throw error
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  return { orders, loading, filters, setFilters, createOrder, updateOrder, deleteOrder, refresh: fetchOrders }
}
