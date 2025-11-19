import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

// Types
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  original_price?: number
  category: string
  image?: string
  images?: string[]
  rating?: number
  reviews?: number
  in_stock: boolean
  featured: boolean
  created_at?: string
  updated_at?: string
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_address: string
  wilaya: string
  items: any[]
  total_amount: number
  status: string
  notes?: string
  created_at?: string
  updated_at?: string
}
