'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { CheckCircle, MapPin } from 'lucide-react'

// ⚠️ ضع رقم الواتساب الخاص بك هنا (بصيغة دولية بدون + أو 00)
const ADMIN_WHATSAPP = '22242415253'

const CITIES = [
  'نواكشوط',
  'نواذيبو',
  'ازويرات',
  'أطار',
  'النعمة',
  'لعيون',
  'الطينطان'
]

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    latitude: '',
    longitude: '',
  })

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع')
      return
    }

    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        })
        setLocationLoading(false)
        alert('✅ تم تحديد موقعك بنجاح!')
      },
      (error) => {
        setLocationLoading(false)
        alert('لم نتمكن من تحديد موقعك. يرجى السماح بالوصول للموقع')
      }
    )
  }

  const sendWhatsAppOrder = () => {
    const deliveryFee = 100 // Fixed delivery fee for all orders
    const totalWithDelivery = cartTotal + deliveryFee
    
    // إنشاء رسالة الطلب
    let message = `🛍️ *طلب جديد من متجر شادي*\n\n`
    message += `👤 *معلومات العميل:*\n`
    message += `الاسم: ${formData.name}\n`
    message += `الهاتف: ${formData.phone}\n`
    message += `العنوان: ${formData.address || 'استخدم الموقع على الخريطة'}\n`
    message += `المدينة: ${formData.city}\n`
    
    if (formData.latitude && formData.longitude) {
      message += `📍 الموقع: https://www.google.com/maps?q=${formData.latitude},${formData.longitude}\n`
    }
    message += `\n`
    
    message += `📦 *المنتجات:*\n`
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `   الكمية: ${item.quantity}\n`
      message += `   السعر: ${item.price} أوقية\n`
      message += `   المجموع: ${item.price * item.quantity} أوقية\n\n`
    })
    
    message += `💰 *الملخص المالي:*\n`
    message += `المجموع الفرعي: ${cartTotal} أوقية\n`
    message += `التوصيل: 100 أوقية 🚚\n`
    message += `*المبلغ الإجمالي: ${totalWithDelivery} أوقية*\n\n`
    
    if (formData.notes) {
      message += `📝 *ملاحظات:*\n${formData.notes}\n\n`
    }
    
    message += `⏰ التاريخ: ${new Date().toLocaleString('ar-MR')}`
    
    // فتح واتساب - يعمل على iPhone و Android
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`
    
    // استخدام window.location بدلاً من window.open للتوافق مع iPhone
    window.location.href = whatsappUrl
  }

  const saveOrderToDatabase = async () => {
    const deliveryFee = 100
    const totalWithDelivery = cartTotal + deliveryFee
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          address: formData.address,
          city: formData.city,
          location: formData.latitude && formData.longitude ? {
            latitude: formData.latitude,
            longitude: formData.longitude,
          } : null,
          notes: formData.notes,
          items: cart,
          subtotal: cartTotal,
          shippingCost: deliveryFee,
          total: totalWithDelivery,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Order saved to database:', result.order.orderNumber)
        return result.order
      }
    } catch (error) {
      console.error('❌ Error saving order:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // حفظ الطلب في قاعدة البيانات
    await saveOrderToDatabase()
    
    // إرسال الطلب عبر واتساب
    sendWhatsAppOrder()
    
    // عرض رسالة النجاح
    setOrderPlaced(true)
    
    // مسح السلة بعد 3 ثواني
    setTimeout(() => {
      clearCart()
    }, 3000)
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">السلة فارغة</h1>
          <Link href="/products" className="btn-primary">
            تسوقي الآن
          </Link>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center max-w-2xl mx-auto px-4">
          <CheckCircle className="w-32 h-32 text-green-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl font-black mb-4">تم إرسال طلبك! ✅</h1>
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
            <p className="text-xl text-gray-800 mb-3 font-semibold">
              📱 تم فتح نافذة الواتساب
            </p>
            <p className="text-lg text-gray-600">
              يرجى الضغط على زر "إرسال" في نافذة الواتساب لإتمام الطلب
            </p>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            سنتواصل معك فوراً عبر الواتساب لتأكيد الطلب والتوصيل 🚚
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/" className="btn-primary">
              العودة للرئيسية
            </Link>
            <Link href="/products" className="btn-secondary">
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-black mb-8 md:mb-12 text-center">
          <span className="gradient-text dark:text-white">إتمام الطلب</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-8 space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold dark:text-white">معلومات التوصيل</h2>
              
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">رقم الجوال *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="مثال: +222 12 34 56 78"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">المدينة *</label>
                <select
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
                >
                  <option value="">اختر المدينة</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">الموقع على الخريطة</label>
                <button
                  type="button"
                  onClick={getLocation}
                  disabled={locationLoading}
                  className="w-full px-4 py-3 rounded-xl border-2 border-primary-400 dark:border-primary-500 text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <MapPin className="w-5 h-5" />
                  {locationLoading ? 'جاري تحديد الموقع...' : formData.latitude ? '✅ تم تحديد الموقع' : 'استخدم موقعي الحالي'}
                </button>
                {formData.latitude && formData.longitude && (
                  <p className="text-sm text-green-600 mt-2 text-center">
                    ✅ سيتم إرسال موقعك على الخريطة مع الطلب
                  </p>
                )}
              </div>

              <div className="text-center text-gray-500 text-sm">أو</div>

              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                  العنوان {!formData.latitude && '*'}
                </label>
                <input
                  type="text"
                  required={!formData.latitude}
                  disabled={!!formData.latitude}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={formData.latitude ? "تم استخدام الموقع على الخريطة" : "مثال: شارع الاستقلال، حي النصر"}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                />
                {formData.latitude && (
                  <p className="text-xs text-gray-500 mt-1">
                    💡 تم تعطيل حقل العنوان لأنك استخدمت الموقع على الخريطة
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-gray-200">ملاحظات إضافية</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                تأكيد الطلب
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-8 sticky top-24">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 dark:text-white">ملخص الطلب</h2>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm dark:text-gray-300">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-bold">{item.price * item.quantity} أوقية</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between dark:text-gray-300">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{cartTotal} أوقية</span>
                </div>
                <div className="flex justify-between dark:text-gray-300">
                  <span>التوصيل</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    100 أوقية 🚚
                  </span>
                </div>
                <div className="border-t-2 dark:border-gray-700 pt-3 flex justify-between text-xl md:text-2xl font-black">
                  <span className="dark:text-white">الإجمالي</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    {cartTotal + 100} أوقية
                  </span>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-300 mt-4">
                🚚 رسوم التوصيل ثابتة 100 أوقية لجميع الطلبات
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
