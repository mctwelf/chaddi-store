import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    
    // إنشاء رقم طلب فريد
    const orderNumber = `ORD-${Date.now()}`
    
    const order = await Order.create({
      orderNumber,
      customerName: body.name,
      customerPhone: body.phone,
      city: body.city,
      address: body.address,
      latitude: body.latitude,
      longitude: body.longitude,
      notes: body.notes,
      items: body.items,
      subtotal: body.subtotal,
      shippingCost: body.shippingCost || 0,
      total: body.total,
      status: 'pending',
      whatsappSent: true,
    })
    
    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100)
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
