'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { Search, Package, Sparkles, Scissors, Heart, Droplet, ShoppingBag } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const iconMap: any = {
    Package,
    Sparkles,
    Scissors,
    Heart,
    Droplet,
    ShoppingBag,
  }

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([
        { id: 'all', name: 'all', name_ar: 'الكل', icon: 'Package' },
        { id: 'skincare', name: 'skincare', name_ar: 'العناية بالبشرة', icon: 'Sparkles' },
        { id: 'haircare', name: 'haircare', name_ar: 'العناية بالشعر', icon: 'Scissors' },
        { id: 'makeup', name: 'makeup', name_ar: 'المكياج', icon: 'Heart' },
      ])
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    // Match category by name, name_ar, or category_id
    let matchesCategory = selectedCategory === 'all'
    if (!matchesCategory) {
      const categoryLower = product.category?.toLowerCase() || ''
      const selectedLower = selectedCategory.toLowerCase()
      const selectedCat = categories.find(c => c.name === selectedCategory)
      
      matchesCategory = categoryLower.includes(selectedLower) || 
                       categoryLower.includes(selectedCat?.name_ar?.toLowerCase() || '') ||
                       product.category_id === selectedCat?.id
    }
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-black text-white text-center">
            جميع المنتجات
          </h1>
          <p className="text-sm md:text-base text-white/90 text-center mt-2">اكتشفي مجموعتنا الكاملة</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحثي عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:border-primary-400 focus:outline-none text-right bg-gray-50 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Categories - Sticky */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 py-3 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => {
              const Icon = iconMap[cat.icon] || Package
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === cat.name
                      ? 'bg-primary-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-bold">{cat.name_ar}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-6">

        {/* Products Grid - 2 Columns Mobile */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-3 animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 aspect-square rounded-lg mb-3"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-lg text-gray-400 dark:text-gray-500">لا توجد منتجات مطابقة للبحث</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
