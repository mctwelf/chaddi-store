import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// DELETE - Delete a category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Don't allow deleting the "all" category
    const { data: category } = await supabase
      .from('categories')
      .select('name')
      .eq('id', id)
      .single()

    if (category?.name === 'all') {
      return NextResponse.json(
        { error: 'Cannot delete the "all" category' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}

// PUT - Update a category
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const { data, error } = await supabase
      .from('categories')
      .update({
        name: body.name,
        name_ar: body.name_ar,
        icon: body.icon,
        display_order: body.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, category: data })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}
