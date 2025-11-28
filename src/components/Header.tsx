'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Moon, Sun, Sparkles, Package, Scissors, Heart, Droplet, ShoppingBag, Camera } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useTheme } from '@/context/ThemeContext'
import { useState, useEffect } from 'react'

export default function Header() {
  const { cartCount } = useCart()
  const { isDark, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  const iconMap: any = {
    Package,
    Sparkles,
    Scissors,
    Heart,
    Droplet,
    ShoppingBag,
  }

  useEffect(() => {
    if (isMenuOpen) {
      fetchCategories()
    }
  }, [isMenuOpen])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data.filter((c: any) => c.name !== 'all') : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  return (
    <header className="bg-white/80 dark:bg-gray-900/95 backdrop-blur-md shadow-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Double click for admin */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
            onDoubleClick={(e) => {
              e.preventDefault()
              window.location.href = '/admin/login'
            }}
            title="Double click for admin"
          >
            <Image 
              src="/logo.png" 
              alt="شادي" 
              width={50} 
              height={50} 
              className="rounded-xl shadow-lg group-hover:shadow-xl transition-all bg-white dark:bg-gray-800 p-1"
            />
            <span className="text-2xl font-bold gradient-text dark:text-white">شادي</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors">
              الرئيسية
            </Link>
            <Link href="/products" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors">
              المنتجات
            </Link>
            <Link href="/assistant" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors">
              <Sparkles className="w-4 h-4" />
              خبيرة شادي
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors">
              من نحن
            </Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors">
              تواصل معنا
            </Link>
          </nav>

          {/* Cart, Dark Mode, Visual Search & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Visual Search */}
            <Link href="/search" className="group hidden md:block">
              <div className="bg-accent-50 dark:bg-accent-900/20 p-3 rounded-full group-hover:bg-accent-100 dark:group-hover:bg-accent-900/40 transition-colors">
                <Camera className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="bg-primary-50 dark:bg-gray-700 p-3 rounded-full hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-primary-600" />
              )}
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative group">
              <div className="bg-primary-50 dark:bg-gray-700 p-3 rounded-full group-hover:bg-primary-100 dark:group-hover:bg-gray-600 transition-colors">
                <ShoppingCart className="w-6 h-6 text-primary-600 dark:text-gray-200" />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-accent-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden bg-primary-50 dark:bg-gray-700 p-3 rounded-full hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-primary-600 dark:text-gray-200" />
              ) : (
                <Menu className="w-6 h-6 text-primary-600 dark:text-gray-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer - Slides from Right */}
        <div
          className={`fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={`fixed top-0 right-0 h-full w-80 shadow-2xl transform transition-transform duration-300 overflow-hidden ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              backgroundColor: isDark ? '#111827' : '#ffffff',
              zIndex: 60
            }}
          >
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">قائمة التنقل</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Drawer Links */}
            <nav className="p-6 flex flex-col gap-4 overflow-y-auto h-full" style={{ backgroundColor: isDark ? '#111827' : '#ffffff' }}>
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800"
              >
                <span className="text-lg">الرئيسية</span>
              </Link>
              <Link
                href="/products"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800"
              >
                <span className="text-lg">المنتجات</span>
              </Link>

              {/* Categories Section */}
              {categories.length > 0 && (
                <div className="border-t border-b border-gray-200 dark:border-gray-700 py-3 my-2">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 px-3 mb-2">التصنيفات</h3>
                  {categories.map((cat) => {
                    const Icon = iconMap[cat.icon] || Package
                    return (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.name}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-base">{cat.name_ar}</span>
                      </Link>
                    )
                  })}
                </div>
              )}

              <Link
                href="/search"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold transition-colors p-4 rounded-lg shadow-lg hover:shadow-xl"
              >
                <Camera className="w-5 h-5" />
                <span className="text-lg">البحث بالصورة</span>
              </Link>
              <Link
                href="/assistant"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold transition-colors p-4 rounded-lg shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-lg">خبيرة شادي التجميلية</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800"
              >
                <span className="text-lg">من نحن</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800"
              >
                <span className="text-lg">تواصل معنا</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
