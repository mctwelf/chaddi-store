import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { image } = await request.json()
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Get base URL for API calls
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'http://localhost:3000'

    // Check if Vision API key is set
    if (!process.env.GOOGLE_VISION_API_KEY) {
      console.error('GOOGLE_VISION_API_KEY is not set')
      // Fallback to random products if no API key
      const productsRes = await fetch(`${baseUrl}/api/products`)
      const allProducts = await productsRes.json()
      const shuffled = allProducts.sort(() => 0.5 - Math.random())
      return NextResponse.json({ 
        products: shuffled.slice(0, 8),
        labels: ['beauty', 'cosmetics'],
        fallback: true
      })
    }
    
    // Remove data:image/jpeg;base64, prefix
    const base64Image = image.includes(',') ? image.split(',')[1] : image
    
    // Call Google Cloud Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64Image },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 15 },
              { type: 'IMAGE_PROPERTIES' },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 }
            ]
          }]
        })
      }
    )
    
    if (!visionResponse.ok) {
      const errorData = await visionResponse.json()
      console.error('Vision API error:', errorData)
      throw new Error('Vision API failed')
    }
    
    const visionData = await visionResponse.json()
    const labels = visionData.responses[0]?.labelAnnotations || []
    const objects = visionData.responses[0]?.localizedObjectAnnotations || []
    
    // Extract keywords from labels and objects
    const keywords = [
      ...labels.map((l: any) => l.description.toLowerCase()),
      ...objects.map((o: any) => o.name.toLowerCase())
    ]
    
    console.log('Vision API detected:', keywords)
    
    // Get all products
    const productsRes = await fetch(`${baseUrl}/api/products`)
    const allProducts = await productsRes.json()
    
    // Match products based on detected labels
    const matchedProducts = allProducts.filter((product: any) => {
      const productText = `${product.name} ${product.description || ''} ${product.category}`.toLowerCase()
      
      // Check if any keyword matches the product
      return keywords.some((keyword: string) => {
        // Beauty/cosmetics related keywords
        const beautyKeywords = [
          'cosmetics', 'beauty', 'makeup', 'skincare', 'skin care',
          'lotion', 'cream', 'serum', 'moisturizer', 'cleanser',
          'face', 'hair', 'shampoo', 'conditioner', 'perfume',
          'lipstick', 'foundation', 'mascara', 'eyeshadow',
          'bottle', 'container', 'product', 'package'
        ]
        
        // If the keyword is beauty-related, match with product
        if (beautyKeywords.some(bk => keyword.includes(bk) || bk.includes(keyword))) {
          return true
        }
        
        // Direct match with product text
        return productText.includes(keyword) || keyword.includes(productText.split(' ')[0])
      })
    })
    
    // If we have matches, return them
    if (matchedProducts.length > 0) {
      return NextResponse.json({ 
        products: matchedProducts.slice(0, 12),
        labels: keywords.slice(0, 10),
        matchCount: matchedProducts.length
      })
    }
    
    // If no matches, return products from same category as detected objects
    const categoryMatches = allProducts.filter((product: any) => {
      const category = product.category?.toLowerCase() || ''
      return keywords.some((keyword: string) => 
        category.includes(keyword) || keyword.includes(category)
      )
    })
    
    if (categoryMatches.length > 0) {
      return NextResponse.json({ 
        products: categoryMatches.slice(0, 12),
        labels: keywords.slice(0, 10),
        matchCount: categoryMatches.length,
        matchType: 'category'
      })
    }
    
    // Fallback: return random beauty products
    const shuffled = allProducts.sort(() => 0.5 - Math.random())
    return NextResponse.json({ 
      products: shuffled.slice(0, 8),
      labels: keywords.slice(0, 10),
      matchCount: 0,
      matchType: 'fallback'
    })
    
  } catch (error: any) {
    console.error('Visual search error:', error)
    
    // Fallback to random products on error
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                      'http://localhost:3000'
      const productsRes = await fetch(`${baseUrl}/api/products`)
      const allProducts = await productsRes.json()
      const shuffled = allProducts.sort(() => 0.5 - Math.random())
      return NextResponse.json({ 
        products: shuffled.slice(0, 8),
        labels: [],
        error: 'Search failed, showing random products',
        fallback: true
      })
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to search', details: error?.message },
        { status: 500 }
      )
    }
  }
}
