export type OrderStatus = 'en_attente' | 'a_verifier' | 'confirme'
export type ReviewStatus = 'en_attente' | 'anomalie' | 'valide'

export interface Order {
  id: string
  user_id: string
  order_code: string
  customer_name: string
  customer_contact: string
  amount: number
  currency: string
  payment_method: string
  status: OrderStatus
  created_at: string
  updated_at: string
}

export interface Receipt {
  id: string
  user_id: string
  order_id: string
  file_path: string
  file_name: string
  reference: string | null
  amount_seen: number | null
  review_status: ReviewStatus
  note: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Order, 'id' | 'created_at'>>
      }
      receipts: {
        Row: Receipt
        Insert: Omit<Receipt, 'id' | 'created_at'>
        Update: Partial<Omit<Receipt, 'id' | 'created_at'>>
      }
    }
  }
}
