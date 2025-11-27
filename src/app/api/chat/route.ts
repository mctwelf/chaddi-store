import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI server-side
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export async function POST(request: NextRequest) {
  try {
    const { message, products } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Build products list
    const productsList = products
      .filter((p: any) => p.inStock)
      .map((p: any) => `- ${p.name} (${p.price} أوقية) [ID:${p.id}] - ${p.category}`)
      .join('\n')

    // Create a beauty expert prompt
    const prompt = `أنت خبيرة تجميل محترفة في متجر شادي للعناية بالبشرة والشعر في موريتانيا. 
      
المنتجات المتوفرة حالياً:
${productsList}

معلومات الشحن:
- شحن مجاني للطلبات فوق 1000 أوقية
- التوصيل لجميع مدن موريتانيا
- يستغرق 2-3 أيام

أجيبي على السؤال التالي بطريقة ودودة ومفيدة باللغة العربية. 
عند التوصية بمنتج، اذكري اسمه بالضبط كما هو في القائمة واذكر [ID:xxx] بجانبه حتى يمكن إضافة رابط له.

السؤال: ${message}

الإجابة (بالعربية فقط، بشكل مختصر ومفيد):`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Replace product IDs with clickable links
    products.forEach((product: any) => {
      const idPattern = new RegExp(`\\[ID:${product.id}\\]`, 'g')
      text = text.replace(idPattern, `[🔗 شاهد المنتج](/products/${product.id})`)
    })

    return NextResponse.json({ response: text })
  } catch (error: any) {
    console.error('Gemini AI Error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response', details: error?.message },
      { status: 500 }
    )
  }
}
