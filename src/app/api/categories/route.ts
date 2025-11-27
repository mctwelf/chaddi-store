import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch all categories
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      // Return default categories if database fails
      return NextResponse.json([
        { id: '1', name: 'all', name_ar: 'الكل', icon: 'Package', display_order: 0 },
        { id: '2', name: 'skincare', name_ar: 'العناية بالبشرة', icon: 'Sparkles', display_order: 1 },
        { id: '3', name: 'haircare', name_ar: 'العناية بالشعر', icon: 'Scissors', display_order: 2 },
        { id: '4', name: 'makeup', name_ar: 'المكياج', icon: 'Heart', display_order: 3 },
      ])
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Return default categories on error
    return NextResponse.json([
      { id: '1', name: 'all', name_ar: 'الكل', icon: 'Package', display_order: 0 },
      { id: '2', name: 'skincare', name_ar: 'العناية بالبشرة', icon: 'Sparkles', display_order: 1 },
      { id: '3', name: 'haircare', name_ar: 'العناية بالشعر', icon: 'Scissors', display_order: 2 },
      { id: '4', name: 'makeup', name_ar: 'المكياج', icon: 'Heart', display_order: 3 },
    ])
  }
}

// POST - Create new category (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: body.name,
        name_ar: body.name_ar,
        icon: body.icon,
        display_order: body.display_order || 0,
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, category: data })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
