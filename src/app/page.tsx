'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Star, TrendingUp, Heart, ShoppingBag, Package, Droplet, Scissors } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  const categories = [
    { id: 'all', name: 'الكل', icon: Package },
    { id: 'skincare', name: 'العناية بالبشرة', icon: Sparkles },
    { id: 'haircare', name: 'العناية بالشعر', icon: Scissors },
    { id: 'makeup', name: 'المكياج', icon: Heart },
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.filter((p: any) => p.inStock))
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category?.toLowerCase().includes(selectedCategory))

  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-700 dark:to-primary-800 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className={`text-center space-y-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block">
              <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold">
                ✨ عروض حصرية حتى 50%
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-white">
              جمالك يبدأ من هنا
            </h1>
            <p className="text-sm md:text-lg text-white/90 max-w-xl mx-auto">
              اكتشفي أفضل منتجات التجميل والعناية بالبشرة والشعر
            </p>
            <div className="flex items-center gap-6 justify-center pt-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">+500</div>
                <div className="text-xs text-white/80">منتج</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">+10K</div>
                <div className="text-xs text-white/80">عميلة</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-2xl md:text-3xl font-bold text-white">
                  4.9 <Star className="w-5 h-5 fill-white text-white" />
                </div>
                <div className="text-xs text-white/80">تقييم</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Mobile Optimized */}
      <section className="py-6 bg-white dark:bg-gray-900 sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-bold">{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Grid - 2 Columns on Mobile */}
      <section className="py-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto px-3">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-3 animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 aspect-square rounded-lg mb-3"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
                </div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product._id || product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  لا توجد منتجات في هذه الفئة
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Bar - Mobile */}
      <section className="py-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-around items-center text-center">
            <div className="flex flex-col items-center">
              <TrendingUp className="w-6 h-6 text-primary-600 mb-1" />
              <span className="text-xs font-bold dark:text-white">منتجات أصلية</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-6 h-6 text-primary-600 mb-1" />
              <span className="text-xs font-bold dark:text-white">شحن مجاني</span>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-6 h-6 text-primary-600 mb-1" />
              <span className="text-xs font-bold dark:text-white">دعم 24/7</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
