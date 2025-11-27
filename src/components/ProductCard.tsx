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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden card-hover group h-full flex flex-col">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-accent-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
              -{discount}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-1 rounded-full text-xs font-bold">
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
            className={`w-full py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1 ${
              product.inStock
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg active:scale-95'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock ? 'أضف' : 'غير متوفر'}
          </button>
        </div>
      </div>
    </Link>
  )
}
