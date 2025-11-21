'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react'

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: BEAUTY_KNOWLEDGE.greetings[0],
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen])

  const getAIResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase()

    // Greetings
    if (msg.includes('مرحبا') || msg.includes('السلام') || msg.includes('هلا') || msg.includes('اهلا')) {
      return BEAUTY_KNOWLEDGE.greetings[1]
    }

    // Skin types
    if (msg.includes('جافة') || msg.includes('جفاف')) {
      return BEAUTY_KNOWLEDGE.skinTypes.dry
    }
    if (msg.includes('دهنية') || msg.includes('دهون')) {
      return BEAUTY_KNOWLEDGE.skinTypes.oily
    }
    if (msg.includes('مختلطة')) {
      return BEAUTY_KNOWLEDGE.skinTypes.combination
    }
    if (msg.includes('حساسة')) {
      return BEAUTY_KNOWLEDGE.skinTypes.sensitive
    }

    // Concerns
    if (msg.includes('حب الشباب') || msg.includes('حبوب') || msg.includes('بثور')) {
      return BEAUTY_KNOWLEDGE.concerns.acne
    }
    if (msg.includes('بقع') || msg.includes('تصبغات') || msg.includes('تفتيح')) {
      return BEAUTY_KNOWLEDGE.concerns.darkSpots
    }
    if (msg.includes('تجاعيد') || msg.includes('خطوط') || msg.includes('شيخوخة')) {
      return BEAUTY_KNOWLEDGE.concerns.wrinkles
    }
    if (msg.includes('جفاف') || msg.includes('ترطيب')) {
      return BEAUTY_KNOWLEDGE.concerns.dryness
    }

    // Products
    if (msg.includes('سيروم')) {
      return BEAUTY_KNOWLEDGE.products.serum
    }
    if (msg.includes('مرطب')) {
      return BEAUTY_KNOWLEDGE.products.moisturizer
    }
    if (msg.includes('واقي') || msg.includes('شمس')) {
      return BEAUTY_KNOWLEDGE.products.sunscreen
    }
    if (msg.includes('ماسك') || msg.includes('قناع')) {
      return BEAUTY_KNOWLEDGE.products.mask
    }

    // Routine
    if (msg.includes('روتين') && msg.includes('صباح')) {
      return BEAUTY_KNOWLEDGE.routine.morning
    }
    if (msg.includes('روتين') && (msg.includes('مساء') || msg.includes('ليل'))) {
      return BEAUTY_KNOWLEDGE.routine.night
    }
    if (msg.includes('روتين')) {
      return 'هل تريدين روتين الصباح أم المساء؟ 🌅🌙'
    }

    // Product recommendations
    if (msg.includes('أفضل منتج') || msg.includes('أنصحيني') || msg.includes('اقترحي')) {
      return 'بالتأكيد! أخبريني عن نوع بشرتك (جافة، دهنية، مختلطة، حساسة) وسأقترح لك أفضل المنتجات! ✨'
    }

    // Price questions
    if (msg.includes('سعر') || msg.includes('كم') || msg.includes('ثمن')) {
      return 'يمكنك رؤية أسعار جميع المنتجات في صفحة المنتجات. لدينا عروض رائعة وشحن مجاني للطلبات فوق 1000 أوقية! 🎁'
    }

    // Shipping
    if (msg.includes('توصيل') || msg.includes('شحن') || msg.includes('وصول')) {
      return 'نوصل لجميع مدن موريتانيا! الشحن مجاني للطلبات فوق 1000 أوقية. التوصيل يستغرق 2-3 أيام. 📦✨'
    }

    // Default response
    return 'شكراً لسؤالك! 💕 يمكنني مساعدتك في:\n\n✨ اختيار المنتجات المناسبة لنوع بشرتك\n🎯 حل مشاكل البشرة (حب الشباب، بقع، تجاعيد)\n📋 بناء روتين عناية كامل\n💡 نصائح استخدام المنتجات\n\nما الذي تحتاجين مساعدة فيه؟'
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI thinking and respond
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        sender: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
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
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
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
