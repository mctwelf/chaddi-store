'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, Package, Sparkles, Scissors, Heart, Droplet, ShoppingBag } from 'lucide-react'

interface Category {
  id?: string
  name: string
  name_ar: string
  icon: string
  display_order: number
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Category>({
    name: '',
    name_ar: '',
    icon: 'Package',
    display_order: 0,
  })

  const availableIcons = [
    { name: 'Package', component: Package },
    { name: 'Sparkles', component: Sparkles },
    { name: 'Scissors', component: Scissors },
    { name: 'Heart', component: Heart },
    { name: 'Droplet', component: Droplet },
    { name: 'ShoppingBag', component: ShoppingBag },
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await fetchCategories()
        setIsAdding(false)
        setFormData({ name: '', name_ar: '', icon: 'Package', display_order: 0 })
        alert('تم إضافة التصنيف بنجاح!')
      } else {
        alert('فشل في إضافة التصنيف')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      alert('حدث خطأ')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchCategories()
        alert('تم حذف التصنيف بنجاح!')
      } else {
        alert('فشل في حذف التصنيف')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('حدث خطأ')
    }
  }

  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find(i => i.name === iconName)
    return icon ? icon.component : Package
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة التصنيفات</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">إضافة وتعديل وحذف تصنيفات المنتجات</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            إضافة تصنيف جديد
          </button>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border-2 border-primary-200 dark:border-primary-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">إضافة تصنيف جديد</h2>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setFormData({ name: '', name_ar: '', icon: 'Package', display_order: 0 })
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    الاسم بالإنجليزية
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="skincare"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    الاسم بالعربية
                  </label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    placeholder="العناية بالبشرة"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:bg-gray-700 dark:text-white text-right"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    الأيقونة
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:bg-gray-700 dark:text-white"
                  >
                    {availableIcons.map((icon) => (
                      <option key={icon.name} value={icon.name}>
                        {icon.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    ترتيب العرض
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false)
                    setFormData({ name: '', name_ar: '', icon: 'Package', display_order: 0 })
                  }}
                  className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  حفظ التصنيف
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const IconComponent = getIconComponent(category.icon)
            return (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{category.name_ar}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{category.name}</p>
                    </div>
                  </div>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                    #{category.display_order}
                  </span>
                </div>

                <div className="flex gap-2">
                  {category.name !== 'all' && (
                    <button
                      onClick={() => handleDelete(category.id!)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 font-semibold transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد تصنيفات بعد</p>
          </div>
        )}
      </div>
    </div>
  )
}
