'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice: number
  category: string
  image: string
  rating: number
  reviews: number
  inStock: boolean
  featured: boolean
}

export default function ProductsManagement() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin-authenticated')
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }
    
    fetchProducts()
  }, [router])

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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setProducts(products.filter(p => p._id !== id))
        alert('✅ تم حذف المنتج بنجاح')
      } else {
        alert('❌ حدث خطأ أثناء حذف المنتج')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('❌ حدث خطأ أثناء حذف المنتج')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 md:py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 dark:text-white">
              إدارة المنتجات
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              إجمالي المنتجات: {products.length}
            </p>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/admin/products/add"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة منتج
            </Link>
            <Link 
              href="/admin"
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              العودة
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">لا توجد منتجات</p>
            <Link href="/admin/products/add" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              إضافة أول منتج
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        غير متوفر
                      </span>
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ⭐ مميز
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-bold text-lg mb-2 dark:text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {product.price} أوقية
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    ⭐ {product.rating} ({product.reviews} تقييم)
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      تعديل
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="px-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
