# 🤖 Visual Search AI Integration Guide

## Current Status
The visual search currently returns random products as a placeholder. To make it work with real AI, you need to integrate an image recognition service.

---

## Option 1: Google Cloud Vision API (Recommended)

### Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Cloud Vision API**
4. Create API credentials
5. Add to `.env.local`:
```env
GOOGLE_VISION_API_KEY=your-api-key-here
```

### Implementation:
Create `/api/visual-search/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { image } = await request.json()
    
    // Remove data:image/jpeg;base64, prefix
    const base64Image = image.split(',')[1]
    
    // Call Google Vision API
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64Image },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'IMAGE_PROPERTIES' },
              { type: 'OBJECT_LOCALIZATION' }
            ]
          }]
        })
      }
    )
    
    const data = await response.json()
    const labels = data.responses[0].labelAnnotations
    
    // Get all products
    const productsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`)
    const allProducts = await productsRes.json()
    
    // Match products based on labels
    const matchedProducts = allProducts.filter((product: any) => {
      const productText = `${product.name} ${product.description} ${product.category}`.toLowerCase()
      return labels.some((label: any) => 
        productText.includes(label.description.toLowerCase())
      )
    })
    
    return NextResponse.json({ 
      products: matchedProducts.slice(0, 12),
      labels: labels.map((l: any) => l.description)
    })
  } catch (error) {
    console.error('Visual search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
```

### Update Search Page:
In `src/app/search/page.tsx`, change the `handleSearch` function:

```typescript
const handleSearch = async () => {
  if (!selectedImage) return
  
  setSearching(true)
  setError(null)
  
  try {
    const res = await fetch('/api/visual-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: selectedImage })
    })
    
    const data = await res.json()
    
    if (data.error) {
      setError('فشل البحث. يرجى المحاولة مرة أخرى.')
      return
    }
    
    setResults(data.products)
    
    if (data.products.length === 0) {
      setError('لم نجد منتجات مشابهة. جربي صورة أخرى.')
    }
  } catch (error) {
    console.error('Search error:', error)
    setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.')
  } finally {
    setSearching(false)
  }
}
```

---

## Option 2: OpenAI CLIP (Advanced)

### Setup:
1. Get OpenAI API key
2. Use CLIP model for image-text matching
3. More accurate but more expensive

```typescript
// Use OpenAI's CLIP model
const response = await fetch('https://api.openai.com/v1/embeddings', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'clip-vit-base-patch32',
    input: base64Image
  })
})
```

---

## Option 3: AWS Rekognition

### Setup:
1. AWS account
2. Enable Rekognition
3. Use SDK

```typescript
import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition'

const client = new RekognitionClient({ region: 'us-east-1' })
const command = new DetectLabelsCommand({
  Image: { Bytes: Buffer.from(base64Image, 'base64') },
  MaxLabels: 10
})

const response = await client.send(command)
```

---

## Quick Fix (Without AI)

For now, you can improve the search by matching image colors:

```typescript
// Extract dominant colors from image
const getDominantColors = (imageBase64: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      
      // Get image data and extract colors
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
      // Color extraction logic here
      
      resolve(['red', 'blue', 'pink']) // Example
    }
    img.src = imageBase64
  })
}

// Then match products by color in category
const colors = await getDominantColors(selectedImage)
const matchedProducts = allProducts.filter(p => 
  colors.some(color => p.category.toLowerCase().includes(color))
)
```

---

## Cost Comparison

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| Google Vision | 1,000/month | $1.50 per 1,000 |
| AWS Rekognition | 5,000/month | $1.00 per 1,000 |
| OpenAI CLIP | No free tier | $0.0004 per image |

---

## Recommendation

**For MVP:** Use Google Cloud Vision API
- Easy to set up
- Good free tier
- Accurate results
- Well documented

**For Production:** Consider OpenAI CLIP
- More accurate
- Better semantic understanding
- Higher cost

---

## Next Steps

1. Choose an AI service
2. Get API key
3. Create `/api/visual-search` endpoint
4. Update search page to use new endpoint
5. Test with real product images
6. Monitor costs and accuracy

**Need help implementing? Let me know which service you prefer!** 🚀
