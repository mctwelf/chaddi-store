'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Star, ShoppingCart, Heart, Share2, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import products from '@/data/products.json'

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { addToCart } = useCart()
  
  const product = products.find(p => p.id === parseInt(id))
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">المنتج غير موجود</h1>
          <Link href="/products" className="btn-primary">
            العودة للمنتجات
          </Link>
        </div>
      </div>
    )
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-primary-600">الرئيسية</Link>
          <span className="text-gray-300">/</span>
          <Link href="/products" className="text-gray-500 hover:text-primary-600">المنتجات</Link>
          <span className="text-gray-300">/</span>
          <span className="text-primary-600 font-semibold">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-3xl shadow-2xl"
            />
            {discount > 0 && (
              <div className="absolute top-6 left-6 bg-accent-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                خصم {discount}%
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="text-primary-600 font-semibold mb-2">{product.category}</div>
              <h1 className="text-4xl font-black mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-accent-400 text-accent-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="font-bold">{product.rating}</span>
                </div>
                <span className="text-gray-500">({product.reviews} تقييم)</span>
              </div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>

            <div className="bg-primary-50 p-6 rounded-2xl">
              <div className="flex items-baseline gap-4 mb-2">
                <div className="text-4xl font-black text-primary-600">{product.price} أوقية</div>
                {product.originalPrice > product.price && (
                  <div className="text-xl text-gray-400 line-through">{product.originalPrice} أوقية</div>
                )}
              </div>
              {discount > 0 && (
                <div className="text-accent-600 font-semibold">وفري {product.originalPrice - product.price} أوقية</div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  product.inStock
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-xl hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {product.inStock ? 'أضف للسلة' : 'غير متوفر'}
              </button>
              <button className="bg-white border-2 border-primary-200 p-4 rounded-full hover:bg-primary-50 transition-colors">
                <Heart className="w-6 h-6 text-primary-600" />
              </button>
              <button className="bg-white border-2 border-primary-200 p-4 rounded-full hover:bg-primary-50 transition-colors">
                <Share2 className="w-6 h-6 text-primary-600" />
              </button>
            </div>

            {product.inStock && (
              <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl text-green-700 font-semibold text-center">
                ✓ متوفر في المخزون
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-black mb-8 text-center">
              <span className="gradient-text">منتجات مشابهة</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(product => (
                <div key={product.id}>
                  <Link href={`/products/${product.id}`}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-bold mb-2 line-clamp-2">{product.name}</h3>
                        <div className="text-xl font-bold text-primary-600">{product.price} أوقية</div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
