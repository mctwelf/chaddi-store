'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { Sparkles, Star, TrendingUp, Heart, ShoppingBag, Package, Droplet, Scissors } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  // Icon mapping
  const iconMap: any = {
    Package,
    Sparkles,
    Scissors,
    Heart,
    Droplet,
    ShoppingBag,
  }

  useEffect(() => {
    setIsVisible(true)
    fetchCategories()
    fetchFeaturedProducts()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Fallback to default categories
      setCategories([
        { id: 'all', name: 'all', name_ar: 'الكل', icon: 'Package' },
        { id: 'skincare', name: 'skincare', name_ar: 'العناية بالبشرة', icon: 'Sparkles' },
        { id: 'haircare', name: 'haircare', name_ar: 'العناية بالشعر', icon: 'Scissors' },
        { id: 'makeup', name: 'makeup', name_ar: 'المكياج', icon: 'Heart' },
      ])
    }
  }

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      
      // Ensure data is an array before filtering
      const productsArray = Array.isArray(data) ? data : []
      setProducts(productsArray.filter((p: any) => p.inStock))
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => {
        // Match by category name or category_id
        const categoryLower = p.category?.toLowerCase() || ''
        const selectedLower = selectedCategory.toLowerCase()
        
        // Try to find the selected category
        const selectedCat = categories.find(c => c.name === selectedCategory)
        
        // Match by name, name_ar, or if product.category_id matches
        return categoryLower.includes(selectedLower) || 
               categoryLower.includes(selectedCat?.name_ar?.toLowerCase() || '') ||
               p.category_id === selectedCat?.id
      })

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "شادي ستور - Chaddi Store",
    "alternateName": ["متجر شادي", "Chaddi Beauty Shop", "شادي للجمال"],
    "description": "متجر شادي (Chaddi Store) - أفضل متجر جمال في موريتانيا. منتجات التجميل والعناية بالبشرة والشعر",
    "url": "https://chaddistore.com",
    "telephone": "+222-XX-XX-XX-XX",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "نواكشوط",
      "addressRegion": "الدهين",
      "addressCountry": "MR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.0735",
      "longitude": "-15.9582"
    },
    "priceRange": "$$",
    "image": "https://chaddistore.com/og-image.jpg",
    "sameAs": [
      "https://facebook.com/chaddistore"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "منتجات التجميل",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "العناية بالبشرة",
          "itemListElement": []
        },
        {
          "@type": "OfferCatalog",
          "name": "العناية بالشعر",
          "itemListElement": []
        },
        {
          "@type": "OfferCatalog",
          "name": "المكياج",
          "itemListElement": []
        }
      ]
    }
  }

  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section - Mobile Optimized */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 dark:from-primary-700 dark:to-primary-800 py-16 md:py-24">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block animate-bounce">
              <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm md:text-base font-bold shadow-lg">
                ✨ عروض حصرية حتى 50%
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight text-white drop-shadow-lg">
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

      {/* Categories - Mobile Optimized with Smooth Scroll */}
      <section className="py-4 md:py-6 bg-white dark:bg-gray-900 sticky top-0 z-40 shadow-lg backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {categories.map((cat, index) => {
              const Icon = iconMap[cat.icon] || Package
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 snap-start ${
                    selectedCategory === cat.name
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-xl scale-105 ring-2 ring-primary-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm md:text-base font-bold">{cat.name_ar}</span>
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
