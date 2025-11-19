import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST - Create new product
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: body.name,
        description: body.description,
        price: body.price,
        original_price: body.originalPrice || body.price,
        category: body.category,
        image: body.image,
        images: body.images || [body.image],
        rating: body.rating || 0,
        reviews: body.reviews || 0,
        in_stock: body.inStock !== undefined ? body.inStock : true,
        featured: body.featured || false,
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, product: data })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

// GET - Fetch all products
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform snake_case to camelCase for compatibility
    const products = data?.map(product => ({
      ...product,
      _id: product.id,
      originalPrice: product.original_price,
      inStock: product.in_stock,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    })) || []

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
