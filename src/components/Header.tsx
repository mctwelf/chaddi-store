'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Moon, Sun } from 'lucide-react'
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t dark:border-gray-700 pt-4">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
            >
              الرئيسية
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
            >
              المنتجات
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
            >
              من نحن
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
            >
              تواصل معنا
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
