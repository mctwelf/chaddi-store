'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowRight, Upload, Save } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  'العناية بالبشرة',
  'العناية بالشعر',
  'المكياج',
  'العطور',
  'العناية بالجسم',
  'أدوات التجميل',
]

export default function EditProduct() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    rating: '0',
    reviews: '0',
    inStock: true,
    featured: false,
  })

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin-authenticated')
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }

    // Fetch product data
    fetchProduct()
  }, [router, productId])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`)
      const product = await res.json()

      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category,
        image: product.image,
        rating: product.rating?.toString() || '0',
        reviews: product.reviews?.toString() || '0',
        inStock: product.inStock,
        featured: product.featured,
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('حدث خطأ أثناء تحميل المنتج')
    } finally {
      setFetching(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. الحد الأقصى 5MB')
      return
    }

    setUploading(true)

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string })
        setUploading(false)
      }
      reader.onerror = () => {
        alert('حدث خطأ أثناء تحميل الصورة')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('حدث خطأ أثناء تحميل الصورة')
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
          rating: parseFloat(formData.rating),
          reviews: parseInt(formData.reviews),
        }),
      })

      if (response.ok) {
        alert('✅ تم تحديث المنتج بنجاح!')
        router.push('/admin/products')
      } else {
        alert('❌ حدث خطأ أثناء تحديث المنتج')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('❌ حدث خطأ أثناء تحديث المنتج')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
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
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 dark:text-white">
              تعديل المنتج
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              تحديث معلومات المنتج
            </p>
          </div>
          <Link 
            href="/admin/products"
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة
          </Link>
        </div>

        {/* Form - Same as Add Product but with PATCH */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
              اسم المنتج *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
            />
          </div>

          {/* Price and Original Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                السعر (أوقية) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                السعر الأصلي (أوقية)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
              التصنيف *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
            >
              <option value="">اختر التصنيف</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
              صورة المنتج *
            </label>
            <div className="space-y-3">
              <div>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-400 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {uploading ? 'جاري التحميل...' : 'اضغط لتحميل صورة جديدة'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">أو</span>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              <input
                type="url"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
                placeholder="أو الصق رابط الصورة هنا"
                disabled={uploading}
              />
            </div>

            {formData.image && (
              <div className="mt-3">
                <p className="text-sm font-semibold mb-2 dark:text-gray-200">معاينة:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full max-w-xs h-48 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          {/* Rating and Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                التقييم (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-200">
                عدد التقييمات
              </label>
              <input
                type="number"
                min="0"
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-semibold dark:text-gray-200">
                متوفر في المخزون
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-semibold dark:text-gray-200">
                منتج مميز
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
