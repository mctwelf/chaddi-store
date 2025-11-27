'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Bot, Trash2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Message {
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const productsRef = useRef<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('beautyAssistantChat')
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
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

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('beautyAssistantChat', JSON.stringify(messages))
    }
  }, [messages])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Fetching products...')
        const res = await fetch('/api/products')
        const data = await res.json()
        
        const productsArray = Array.isArray(data) ? data : []
        console.log('✅ Products fetched:', productsArray.length)
        
        setProducts(productsArray)
        productsRef.current = productsArray
      } catch (error) {
        console.error('❌ Error fetching products:', error)
        setProducts([])
        productsRef.current = []
      }
    }
    fetchProducts()
  }, [])

  // Show welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        text: 'مرحباً بك في خبيرة شادي التجميلية! 💕\n\nأنا هنا لمساعدتك في اختيار أفضل منتجات العناية بالبشرة والشعر.\n\nكيف يمكنني مساعدتك اليوم؟',
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      console.log('🤖 Getting AI response for:', userMessage)
      console.log('📦 Products loaded:', productsRef.current?.length || 0)
      
      if (!productsRef.current || productsRef.current.length === 0) {
        console.warn('⚠️ Products not loaded, waiting...')
        
        let attempts = 0
        while ((!productsRef.current || productsRef.current.length === 0) && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 500))
          attempts++
        }
        
        if (!productsRef.current || productsRef.current.length === 0) {
          console.error('❌ Products failed to load')
          return 'عذراً، حدث خطأ في تحميل المنتجات. يرجى تحديث الصفحة والمحاولة مرة أخرى.'
        }
        
        console.log('✅ Products loaded after waiting:', productsRef.current.length)
      }

      console.log('🚀 Calling AI API...')
      
      const productData = (productsRef.current || []).map(p => ({
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
      
      return 'شكراً لسؤالك! 💕 يمكنني مساعدتك في اختيار المنتجات المناسبة. أخبريني عن نوع بشرتك أو ما تبحثين عنه؟'
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    const aiResponse = await getAIResponse(inputValue)

    const assistantMessage: Message = {
      text: aiResponse,
      sender: 'assistant',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  const clearChat = () => {
    if (confirm('هل تريدين حذف المحادثة؟')) {
      setMessages([])
      localStorage.removeItem('beautyAssistantChat')
      
      const welcomeMessage: Message = {
        text: 'مرحباً بك في خبيرة شادي التجميلية! 💕\n\nأنا هنا لمساعدتك في اختيار أفضل منتجات العناية بالبشرة والشعر.\n\nكيف يمكنني مساعدتك اليوم؟',
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }

  const parseMessageWithLinks = (text: string) => {
    const parts = text.split(/(\[🔗 شاهد المنتج\]\(\/products\/\d+\))/)
    
    return parts.map((part, index) => {
      const linkMatch = part.match(/\[🔗 شاهد المنتج\]\((\/products\/(\d+))\)/)
      if (linkMatch) {
        const productId = linkMatch[2]
        const product = productsRef.current?.find(p => p.id === parseInt(productId))
        
        if (product) {
          return (
            <Link
              key={index}
              href={linkMatch[1]}
              className="block my-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-primary-200 dark:border-primary-700 hover:border-primary-400"
            >
              <div className="flex gap-3 p-3">
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {product.price} أوقية
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-xs bg-primary-600 text-white px-3 py-1 rounded-full font-bold">
                      شاهد المنتج ←
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        }
        
        return (
          <Link
            key={index}
            href={linkMatch[1]}
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 shadow-md my-1"
          >
            🔗 شاهد المنتج
          </Link>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full animate-pulse">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <h1 className="text-xl font-bold text-white">خبيرة شادي التجميلية</h1>
                <p className="text-xs text-white/80">مساعدتك الذكية للعناية بالجمال</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
              title="حذف المحادثة"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl p-4 pb-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'} mb-4 animate-fadeIn`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md border border-gray-200 dark:border-gray-700'
                    : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg'
                }`}
              >
                {message.sender === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
                    <div className="bg-white/20 p-1 rounded-full">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">خبيرة شادي</span>
                  </div>
                )}
                <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                  {parseMessageWithLinks(message.text)}
                </div>
                <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-gray-400' : 'text-white/70'}`}>
                  {message.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-end mb-4 animate-fadeIn">
              <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/20">
                  <div className="bg-white/20 p-1 rounded-full">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold">خبيرة شادي</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input - Fixed at bottom, nothing below */}
      <div className="bg-white dark:bg-gray-800 border-t-2 border-primary-200 dark:border-primary-700 p-4 shadow-2xl flex-shrink-0">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-3 items-center">
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-primary-600 to-primary-500 text-white p-4 rounded-full hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95 flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
              placeholder="اكتبي سؤالك هنا... 💬"
              className="flex-1 px-5 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-primary-400 focus:ring-2 focus:ring-primary-200 focus:outline-none text-right bg-gray-50 dark:bg-gray-900 dark:text-white text-base transition-all"
              disabled={isTyping}
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  )
}
