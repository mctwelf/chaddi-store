'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const { showToast } = useToast()
  
  const handleRemove = (id: number, name: string) => {
    removeFromCart(id)
    showToast(`تم حذف ${name} من السلة`, 'info')
  }
  
  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateQuantity(id, quantity)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-4xl font-black mb-4">السلة فارغة</h1>
          <p className="text-xl text-gray-600 mb-8">لم تضيفي أي منتجات بعد</p>
          <Link href="/products" className="btn-primary">
            تسوقي الآن
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 md:py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-black mb-8 md:mb-12 text-center">
          <span className="gradient-text dark:text-white">سلة التسوق</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6">
                <div className="flex gap-4 md:gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2 dark:text-white truncate">{item.name}</h3>
                    <p className="text-primary-600 dark:text-primary-400 font-bold text-sm md:text-lg mb-3 md:mb-4">{item.price} أوقية</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 md:gap-3 bg-gray-100 dark:bg-gray-700 rounded-full p-1 md:p-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="bg-white dark:bg-gray-600 rounded-full p-1.5 md:p-2 hover:bg-primary-50 dark:hover:bg-gray-500 transition-colors"
                        >
                          <Minus className="w-3 h-3 md:w-4 md:h-4 dark:text-white" />
                        </button>
                        <span className="px-2 md:px-4 font-bold text-sm md:text-base dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="bg-white dark:bg-gray-600 rounded-full p-1.5 md:p-2 hover:bg-primary-50 dark:hover:bg-gray-500 transition-colors"
                        >
                          <Plus className="w-3 h-3 md:w-4 md:h-4 dark:text-white" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right hidden md:block">
                    <div className="text-lg md:text-xl font-bold dark:text-white">
                      {item.price * item.quantity} أوقية
                    </div>
                  </div>
                </div>
                {/* Mobile total */}
                <div className="md:hidden mt-3 pt-3 border-t dark:border-gray-700 text-right">
                  <div className="text-lg font-bold dark:text-white">
                    المجموع: {item.price * item.quantity} أوقية
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              إفراغ السلة
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-8 sticky top-24">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 dark:text-white">ملخص الطلب</h2>
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex justify-between text-base md:text-lg dark:text-gray-300">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{cartTotal} أوقية</span>
                </div>
                <div className="flex justify-between text-base md:text-lg dark:text-gray-300">
                  <span>الشحن</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {cartTotal >= 1000 ? '🎉 مجاني' : 'يحدده المسؤول'}
                  </span>
                </div>
                <div className="border-t-2 dark:border-gray-700 pt-3 md:pt-4 flex justify-between text-xl md:text-2xl font-black">
                  <span className="dark:text-white">الإجمالي</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    {cartTotal} أوقية {cartTotal >= 1000 ? '+ شحن مجاني' : '+ تكلفة الشحن'}
                  </span>
                </div>
              </div>
              {cartTotal >= 1000 ? (
                <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl text-sm text-green-700 mb-6">
                  🎉 مبروك! حصلتي على شحن مجاني
                </div>
              ) : (
                <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl text-sm text-blue-700 mb-6">
                  💡 أضيفي {1000 - cartTotal} أوقية للحصول على شحن مجاني<br/>
                  <span className="text-xs">تكلفة الشحن سيحددها المسؤول حسب موقعك</span>
                </div>
              )}
              <Link href="/checkout" className="btn-primary w-full block text-center">
                إتمام الطلب
              </Link>
              <Link
                href="/products"
                className="btn-secondary w-full block text-center mt-4"
              >
                متابعة التسوق
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
