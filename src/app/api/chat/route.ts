import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    // Check if API key is set
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('GOOGLE_AI_API_KEY is not set')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const { message, products } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Build products list
    const productsList = products
      .filter((p: any) => p.inStock)
      .map((p: any) => `- ${p.name} (${p.price} أوقية) [ID:${p.id}] - ${p.category}`)
      .join('\n')

    // Create a beauty expert prompt with detailed instructions
    const prompt = `أنت خبيرة تجميل محترفة متخصصة في متجر شادي للعناية بالبشرة والشعر في موريتانيا. 
      
المنتجات المتوفرة حالياً:
${productsList}

معلومات الشحن:
- شحن مجاني للطلبات فوق 1000 أوقية
- التوصيل لجميع مدن موريتانيا
- يستغرق 2-3 أيام عمل

تعليمات مهمة:
1. أجيبي بطريقة ودودة ومهنية باللغة العربية
2. عند التوصية بمنتج، قدمي معلومات شاملة:
   - اسم المنتج بالضبط كما في القائمة
   - فوائده الرئيسية
   - طريقة الاستخدام المثلى
   - عدد مرات الاستخدام (يومياً، أسبوعياً، إلخ)
   - أي نصائح إضافية مهمة
3. اذكري [ID:xxx] بعد كل منتج توصين به لإضافة رابط له
4. كوني محددة ومفصلة في شرح طريقة الاستخدام
5. إذا كان السؤال عن نوع بشرة معين، وصي بالمنتجات المناسبة فقط

السؤال: ${message}

الإجابة (بالعربية، مفصلة ومفيدة مع شرح طريقة الاستخدام):`

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
