'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Moon, Sun, Sparkles } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useTheme } from '@/context/ThemeContext'
import { useState } from 'react'

export default function Header() {
  const { cartCount } = useCart()
  const { isDark, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

          {/* Cart, Dark Mode & Mobile Menu */}
          <div className="flex items-center gap-4">
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
            className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
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
            <nav className="p-6 flex flex-col gap-4">
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
