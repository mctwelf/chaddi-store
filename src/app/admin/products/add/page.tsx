'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function AddProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    images: [] as string[], // Multiple images
    rating: '0',
    reviews: '0',
    inStock: true,
    featured: false,
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check total files
    if (formData.images.length + files.length > 5) {
      alert('يمكنك إضافة 5 صور كحد أقصى')
      return
    }

    setUploading(true)

    try {
      const newImages: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`الصورة ${file.name} كبيرة جداً. الحد الأقصى 5MB`)
          continue
        }

        // Convert to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        newImages.push(base64)
      }

      // Set first image as main image if not set
      const mainImage = formData.image || newImages[0] || ''
      
      setFormData({ 
        ...formData, 
        image: mainImage,
        images: [...formData.images, ...newImages]
      })
      setUploading(false)
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('حدث خطأ أثناء تحميل الصور')
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    const newMainImage = newImages[0] || ''
    setFormData({ 
      ...formData, 
      images: newImages,
      image: newMainImage
    })
  }

  const setMainImage = (imageUrl: string) => {
    setFormData({ ...formData, image: imageUrl })
  }

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin-authenticated')
    if (!isAuthenticated) {
      router.push('/admin/login')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
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
        alert('✅ تم إضافة المنتج بنجاح!')
        router.push('/admin/products')
      } else {
        alert('❌ حدث خطأ أثناء إضافة المنتج')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('❌ حدث خطأ أثناء إضافة المنتج')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 md:py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black mb-2 dark:text-white">
              إضافة منتج جديد
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              أضف منتج جديد إلى المتجر
            </p>
          </div>
          <Link 
            href="/admin"
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة
          </Link>
        </div>

        {/* Form */}
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
              placeholder="مثال: سيروم فيتامين سي المضيء"
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
              placeholder="وصف المنتج..."
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
                placeholder="299"
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
                placeholder="399 (اختياري للخصم)"
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
              صور المنتج * (حتى 5 صور)
            </label>
            <div className="space-y-3">
              {/* File Upload */}
              <div>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-400 transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {uploading ? 'جاري التحميل...' : 'اضغط لتحميل صور (يمكنك اختيار عدة صور)'}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PNG, JPG, WEBP (حد أقصى 5MB لكل صورة)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading || formData.images.length >= 5}
                  />
                </label>
              </div>

              {/* Images Grid */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-3 dark:text-gray-200">
                    الصور ({formData.images.length}/5):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`صورة ${index + 1}`}
                          className={`w-full h-32 object-cover rounded-xl border-2 ${
                            formData.image === img 
                              ? 'border-primary-500' 
                              : 'border-gray-200 dark:border-gray-600'
                          }`}
                        />
                        {formData.image === img && (
                          <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-bold">
                            رئيسية
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                          {formData.image !== img && (
                            <button
                              type="button"
                              onClick={() => setMainImage(img)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold"
                            >
                              جعلها رئيسية
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                placeholder="4.8"
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
                placeholder="234"
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
                منتج مميز (يظهر في الصفحة الرئيسية)
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
              {loading ? 'جاري الحفظ...' : 'حفظ المنتج'}
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
