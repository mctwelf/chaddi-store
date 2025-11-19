import { createClient } from '@supabase/supabase-js'

// Fallback to actual values for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hsqzcyxotfveuebqhqla.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzcXpjeXhvdGZ2ZXVlYnFocWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1ODQ5MTMsImV4cCI6MjA3OTE2MDkxM30.wwB9NL1suK6hYGIoXO2GlhSOyOVWq8oDUDCefiRP91E'

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
