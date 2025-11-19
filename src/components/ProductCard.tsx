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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden card-hover group">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              خصم {discount}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-full font-bold">
                غير متوفر
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="text-sm text-primary-600 dark:text-primary-400 font-semibold mb-2">{product.category}</div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
              <span className="font-semibold dark:text-gray-200">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">({product.reviews} تقييم)</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{product.price} أوقية</div>
              {product.originalPrice > product.price && (
                <div className="text-sm text-gray-400 dark:text-gray-500 line-through">{product.originalPrice} أوقية</div>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              product.inStock
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {product.inStock ? 'أضف للسلة' : 'غير متوفر'}
          </button>
        </div>
      </div>
    </Link>
  )
}
