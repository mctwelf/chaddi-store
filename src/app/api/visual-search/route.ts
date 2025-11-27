import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { image } = await request.json()
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Get base URL for API calls
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    // NOTE: Google Cloud Vision API requires billing to be enabled
    // To enable: https://console.developers.google.com/billing/enable?project=282594764717
    // For now, using fallback search that returns random products
    
    console.log('Visual search: Using fallback (Vision API requires billing)')
    
    // Get all products
    const productsRes = await fetch(`${baseUrl}/api/products`)
    const allProducts = await productsRes.json()
    
    // Return random products
    const shuffled = allProducts.sort(() => 0.5 - Math.random())
    return NextResponse.json({ 
      products: shuffled.slice(0, 12),
      labels: ['beauty', 'cosmetics'],
      fallback: true,
      message: 'Showing random beauty products'
    })
  } catch (error: any) {
    console.error('Visual search error:', error)
    return NextResponse.json(
      { error: 'Search failed', details: error?.message },
      { status: 500 }
    )
  }
}
