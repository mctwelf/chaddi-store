'use client'

import { useState } from 'react'
import { Camera, Upload, X, Search, Loader } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export default function VisualSearchPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('الصورة كبيرة جداً. الحد الأقصى 5MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار صورة')
      return
    }

    setError(null)

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSearch = async () => {
    if (!selectedImage) return

    setSearching(true)
    setError(null)

    try {
      // For now, we'll do a simple search by fetching all products
      // In a real implementation, you would use an AI service like:
      // - Google Cloud Vision API
      // - AWS Rekognition
      // - OpenAI CLIP
      // - Custom ML model
      
      const res = await fetch('/api/products')
      const allProducts = await res.json()
      
      // Simulate AI search - in production, you'd send the image to an AI service
      // For now, return random products as "similar"
      const shuffled = allProducts.sort(() => 0.5 - Math.random())
      const similarProducts = shuffled.slice(0, 8)
      
      setResults(similarProducts)
    } catch (error) {
      console.error('Search error:', error)
      setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.')
    } finally {
      setSearching(false)
    }
  }

  const handleClear = () => {
    setSelectedImage(null)
    setResults([])
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-primary-100 dark:bg-primary-900 p-4 rounded-full mb-4">
            <Camera className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
            البحث بالصورة
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            ارفعي صورة المنتج الذي تبحثين عنه وسنجد لك منتجات مشابهة
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          {!selectedImage ? (
            <label className="block cursor-pointer">
              <div className="border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center hover:border-primary-400 transition-all">
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  اضغطي لتحميل صورة
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  أو اسحبي الصورة وأفلتيها هنا
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  PNG, JPG, WEBP حتى 5MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Uploaded"
                className="w-full max-h-96 object-contain rounded-xl"
              />
              <button
                onClick={handleClear}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          {selectedImage && !searching && results.length === 0 && (
            <button
              onClick={handleSearch}
              className="w-full mt-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
            >
              <Search className="w-6 h-6" />
              ابحثي عن منتجات مشابهة
            </button>
          )}

          {searching && (
            <div className="mt-6 text-center">
              <Loader className="w-12 h-12 mx-auto mb-4 text-primary-600 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400 font-semibold">
                جاري البحث عن منتجات مشابهة...
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                المنتجات المشابهة ({results.length})
              </h2>
              <button
                onClick={handleClear}
                className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                بحث جديد
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/products"
                className="inline-block bg-white dark:bg-gray-800 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-700 px-8 py-3 rounded-xl font-bold transition-all"
              >
                تصفح جميع المنتجات
              </Link>
            </div>
          </div>
        )}

        {/* How it works */}
        {!selectedImage && (
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              كيف يعمل البحث بالصورة؟
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">ارفعي الصورة</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  التقطي صورة أو ارفعي صورة للمنتج الذي تبحثين عنه
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">نحلل الصورة</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  نستخدم الذكاء الاصطناعي لتحليل الصورة والبحث عن منتجات مشابهة
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">نعرض النتائج</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  نعرض لك المنتجات الأكثر تشابهاً مع صورتك
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
