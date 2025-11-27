'use client'

import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice: number
  description: string
  image: string
  rating: number
  reviews: number
  inStock: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    showToast(`تم إضافة ${product.name} إلى السلة ✅`, 'success')
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden card-hover group h-full flex flex-col transform transition-all duration-300 hover:shadow-2xl active:scale-95">
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold shadow-xl animate-pulse">
              -{discount}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                غير متوفر
              </span>
            </div>
          )}
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-1 truncate">{product.category}</div>
          <h3 className="text-sm md:text-base font-bold mb-2 text-gray-800 dark:text-white line-clamp-2 flex-1">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-accent-400 text-accent-400" />
            <span className="text-xs font-semibold dark:text-gray-200">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
          <div className="mb-2">
            <div className="text-lg md:text-xl font-bold text-primary-600 dark:text-primary-400">{product.price} أوقية</div>
            {product.originalPrice > product.price && (
              <div className="text-xs text-gray-400 dark:text-gray-500 line-through">{product.originalPrice}</div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-2.5 md:py-3 rounded-xl text-sm md:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              product.inStock
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-xl hover:scale-105 active:scale-95 shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            {product.inStock ? 'أضف للسلة' : 'غير متوفر'}
          </button>
        </div>
      </div>
    </Link>
  )
}
