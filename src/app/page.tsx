'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Star, TrendingUp, Heart, ShoppingBag } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      const featured = data.filter((p: any) => p.featured && p.inStock).slice(0, 6)
      setFeaturedProducts(featured)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-right space-y-6">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  ✨ عروض حصرية حتى 50%
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                <span className="gradient-text dark:text-primary-400">جمالك</span> يبدأ من
                <br />
                <span className="text-gray-800 dark:text-white">هنا</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                اكتشفي أفضل منتجات التجميل والعناية بالبشرة والشعر من أرقى العلامات التجارية العالمية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products" className="btn-primary">
                  <ShoppingBag className="inline-block ml-2 w-5 h-5" />
                  تسوقي الآن
                </Link>
                <Link href="/about" className="btn-secondary">
                  اعرفي المزيد
                </Link>
              </div>
              <div className="flex items-center gap-8 justify-center lg:justify-start pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">+500</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">منتج</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">+10K</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">عميلة سعيدة</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-3xl font-bold text-primary-600 dark:text-primary-400">
                    4.9 <Star className="w-6 h-6 fill-accent-400 text-accent-400" />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">تقييم العملاء</div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"
                  alt="Beauty Products"
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">
            <span className="gradient-text dark:text-white">لماذا تختارينا؟</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-white dark:from-gray-700 dark:to-gray-800 shadow-lg card-hover">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">منتجات أصلية</h3>
              <p className="text-gray-600 dark:text-gray-300">جميع منتجاتنا أصلية ومضمونة من العلامات التجارية العالمية</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-accent-50 to-white dark:from-gray-700 dark:to-gray-800 shadow-lg card-hover">
              <div className="bg-gradient-to-br from-accent-500 to-accent-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">شحن مجاني</h3>
              <p className="text-gray-600 dark:text-gray-300">توصيل مجاني لجميع الطلبات فوق 1000 أوقية</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-white dark:from-gray-700 dark:to-gray-800 shadow-lg card-hover">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">دعم 24/7</h3>
              <p className="text-gray-600 dark:text-gray-300">خصومات وعروض خاصة لعملائنا المميزين</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-accent-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-center mb-4">
              <span className="gradient-text dark:text-white">المنتجات المميزة</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">اختيارات خاصة من أفضل منتجاتنا</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-2/3"></div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  لا توجد منتجات مميزة حالياً
                </p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary">
              عرض جميع المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-700 dark:to-primary-600">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-white animate-pulse" />
          <h2 className="text-4xl font-black mb-4 text-white">انضمي إلى عائلة شادي</h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            احصلي على خصم 15% على أول طلب واستمتعي بعروض حصرية
          </p>
          <Link href="/products" className="bg-white text-primary-600 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-block">
            ابدئي التسوق الآن
          </Link>
        </div>
      </section>
    </div>
  )
}
