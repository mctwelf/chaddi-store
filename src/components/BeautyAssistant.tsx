'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, Bot, Trash2 } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

const BEAUTY_KNOWLEDGE = {
  greetings: [
    'مرحباً! 👋 أنا مساعدتك الجمالية الذكية. كيف يمكنني مساعدتك اليوم؟',
    'أهلاً وسهلاً! ✨ أنا هنا لمساعدتك في اختيار أفضل المنتجات. ما الذي تبحثين عنه؟',
  ],
  skinTypes: {
    dry: 'للبشرة الجافة، أنصحك بمنتجات غنية بحمض الهيالورونيك والسيراميد. جربي مرطب حمض الهيالورونيك وسيروم فيتامين سي.',
    oily: 'للبشرة الدهنية، استخدمي منتجات خفيفة وخالية من الزيوت. أنصح بمنظف لطيف وتونر ماء الورد.',
    combination: 'للبشرة المختلطة، استخدمي منتجات متوازنة. جربي مجموعة العناية بالبشرة الكاملة.',
    sensitive: 'للبشرة الحساسة، اختاري منتجات لطيفة وخالية من العطور. ماسك الطين المغربي مثالي لك.',
  },
  concerns: {
    acne: 'لعلاج حب الشباب، أنصح بمنتجات تحتوي على حمض الساليسيليك أو البنزويل بيروكسايد. استخدمي منظف لطيف مرتين يومياً.',
    darkSpots: 'لتفتيح البقع الداكنة، سيروم فيتامين سي هو الأفضل! استخدميه صباحاً ومساءً مع واقي الشمس.',
    wrinkles: 'لمكافحة التجاعيد، كريم الريتينول الليلي مثالي. استخدميه كل ليلة مع مرطب جيد.',
    dryness: 'للجفاف، مرطب حمض الهيالورونيك سيغير حياتك! استخدميه على بشرة رطبة لأفضل النتائج.',
  },
  products: {
    serum: 'السيروم يُستخدم بعد التنظيف وقبل المرطب. ضعي 2-3 قطرات وافركيها بلطف على الوجه والرقبة.',
    moisturizer: 'المرطب يُستخدم صباحاً ومساءً بعد السيروم. دلكيه بحركات دائرية حتى يمتص بالكامل.',
    sunscreen: 'واقي الشمس ضروري كل يوم! استخدمي SPF 50 حتى في الأيام الغائمة. أعيدي وضعه كل ساعتين.',
    mask: 'الماسك يُستخدم 2-3 مرات أسبوعياً. ضعيه لمدة 15-20 دقيقة ثم اشطفيه بالماء الفاتر.',
  },
  routine: {
    morning: 'روتين الصباح:\n1. منظف لطيف\n2. تونر\n3. سيروم فيتامين سي\n4. مرطب\n5. واقي شمس SPF 50',
    night: 'روتين المساء:\n1. مزيل مكياج\n2. منظف\n3. تونر\n4. سيروم أو ريتينول\n5. كريم العين\n6. مرطب ليلي',
  },
}

export default function BeautyAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const productsRef = useRef<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('beautyAssistantChat')
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(messagesWithDates)
      } catch (error) {
        console.error('Error loading chat history:', error)
      }
    }
  }, [])

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('beautyAssistantChat', JSON.stringify(messages))
    }
  }, [messages])

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Fetching products...')
        const res = await fetch('/api/products')
        const data = await res.json()
        console.log('✅ Products fetched:', data.length)
        setProducts(data)
        productsRef.current = data
      } catch (error) {
        console.error('❌ Error fetching products:', error)
      }
    }
    fetchProducts()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message only if no chat history
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: BEAUTY_KNOWLEDGE.greetings[0],
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      console.log('🤖 Getting AI response for:', userMessage)
      console.log('📦 Products loaded:', productsRef.current.length)
      
      // Wait for products to load if not loaded yet
      if (productsRef.current.length === 0) {
        console.warn('⚠️ Products not loaded, waiting...')
        
        // Wait up to 5 seconds for products to load
        let attempts = 0
        while (productsRef.current.length === 0 && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 500))
          attempts++
        }
        
        if (productsRef.current.length === 0) {
          console.error('❌ Products failed to load')
          return 'عذراً، حدث خطأ في تحميل المنتجات. يرجى تحديث الصفحة والمحاولة مرة أخرى.'
        }
        
        console.log('✅ Products loaded after waiting:', productsRef.current.length)
      }

      console.log('🚀 Calling AI API...')
      
      // Send only essential product data to avoid 413 error
      const productData = productsRef.current.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        inStock: p.inStock
      }))
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          products: productData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', response.status, errorData)
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ AI API responded')
      
      return data.response || 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.'
    } catch (error: any) {
      console.error('❌ AI Error:', error)
      console.error('Error details:', error?.message)
      
      // Fallback to basic response
      return 'شكراً لسؤالك! 💕 يمكنني مساعدتك في اختيار المنتجات المناسبة. أخبريني عن نوع بشرتك أو ما تبحثين عنه؟'
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userInput = inputValue

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Get AI response
    try {
      const aiText = await getAIResponse(userInput)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    if (confirm('هل تريدين مسح المحادثة؟ سيتم حذف جميع الرسائل.')) {
      setMessages([])
      localStorage.removeItem('beautyAssistantChat')
      // Show welcome message again
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: BEAUTY_KNOWLEDGE.greetings[0],
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }

  const quickQuestions = [
    'ما هو أفضل منتج للبشرة الجافة؟',
    'كيف أعالج حب الشباب؟',
    'ما هو روتين العناية الصباحي؟',
    'كيف أستخدم السيروم؟',
  ]

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary-600 to-primary-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 ${
          isOpen ? 'hidden' : 'flex'
        } items-center gap-2 group`}
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="hidden group-hover:inline-block text-sm font-bold whitespace-nowrap">
          مساعدة جمالية ذكية
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">مساعدتك الجمالية</h3>
                <p className="text-white/80 text-xs">متصلة الآن • ترد فوراً</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                title="مسح المحادثة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none shadow-md'
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">
                    {message.text.split(/(\[🔗 شاهد المنتج\]\(\/products\/[^\)]+\))/).map((part, i) => {
                      const linkMatch = part.match(/\[🔗 شاهد المنتج\]\((\/products\/[^\)]+)\)/)
                      if (linkMatch) {
                        return (
                          <a
                            key={i}
                            href={linkMatch[1]}
                            className="inline-flex items-center gap-1 bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold transition-colors mx-1"
                            onClick={(e) => {
                              e.preventDefault()
                              window.location.href = linkMatch[1]
                            }}
                          >
                            🔗 شاهد المنتج
                          </a>
                        )
                      }
                      return <span key={i}>{part}</span>
                    })}
                  </div>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString('ar-MR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">أسئلة سريعة:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputValue(q)
                      setTimeout(handleSend, 100)
                    }}
                    className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتبي سؤالك هنا..."
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-900 border-0 rounded-full focus:ring-2 focus:ring-primary-500 dark:text-white"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-3 rounded-full hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
