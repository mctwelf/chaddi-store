import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name: body.name,
        customer_phone: body.phone,
        customer_email: body.email,
        customer_address: body.address,
        wilaya: body.city || body.wilaya,
        items: body.items,
        total_amount: body.total,
        status: 'pending',
        notes: body.notes,
      }])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ success: true, order: data })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) throw error
    
    // Transform to camelCase
    const orders = data?.map(order => ({
      ...order,
      _id: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      customerAddress: order.customer_address,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    })) || []
    
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
