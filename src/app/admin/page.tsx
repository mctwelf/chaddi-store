'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Phone, MapPin, Calendar, CheckCircle, Clock, Truck, XCircle, Search, TrendingUp, DollarSign, ShoppingBag, LogOut, Plus } from 'lucide-react'
import Link from 'next/link'

interface Order {
  _id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  city: string
  address: string
  latitude?: number
  longitude?: number
  notes?: string
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }>
  subtotal: number
  shippingCost: number
  total: number
  status: string
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('admin-authenticated')
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }
    
    fetchOrders()
  }, [router])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (res.ok) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ))
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-authenticated')
    localStorage.removeItem('admin-login-time')
    router.push('/admin/login')
  }

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    todayOrders: orders.filter(o => {
      const today = new Date().toDateString()
      return new Date(o.createdAt).toDateString() === today
    }).length,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'قيد الانتظار',
      processing: 'قيد المعالجة',
      shipped: 'تم الشحن',
      delivered: 'تم التسليم',
      cancelled: 'ملغي',
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const filteredOrders = orders
    .filter(order => filter === 'all' || order.status === filter)
    .filter(order => 
      searchTerm === '' ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm)
    )

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
              لوحة التحكم
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              مرحباً بك في لوحة إدارة المتجر
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link 
              href="/admin/products/add"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة منتج
            </Link>
            <Link 
              href="/admin/products"
              className="btn-secondary flex items-center gap-2"
            >
              <Package className="w-5 h-5" />
              المنتجات
            </Link>
            <Link 
              href="/"
              className="btn-secondary"
            >
              المتجر
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-black">{stats.total}</span>
            </div>
            <p className="text-primary-100">إجمالي الطلبات</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-black">{stats.totalRevenue}</span>
            </div>
            <p className="text-green-100">إجمالي المبيعات (أوقية)</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-black">{stats.todayOrders}</span>
            </div>
            <p className="text-blue-100">طلبات اليوم</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-3xl font-black">{stats.pending}</span>
            </div>
            <p className="text-yellow-100">قيد الانتظار</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            الكل ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filter === 'pending'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            قيد الانتظار ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filter === 'processing'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            قيد المعالجة ({orders.filter(o => o.status === 'processing').length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filter === 'delivered'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            تم التسليم ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">لا توجد طلبات</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(order.status)}
                      <h3 className="text-lg md:text-xl font-bold dark:text-white">
                        {order.orderNumber}
                      </h3>
                    </div>
                    
                    <div className="space-y-2 text-sm md:text-base">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4" />
                        <span className="font-semibold">{order.customerName}</span>
                        <span>-</span>
                        <a href={`tel:${order.customerPhone}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                          {order.customerPhone}
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{order.city}</span>
                        {order.address && <span>- {order.address}</span>}
                      </div>
                      
                      {order.latitude && order.longitude && (
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            📍 عرض الموقع على الخريطة
                          </a>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.createdAt).toLocaleString('ar-MR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {order.total} أوقية
                    </div>
                    
                    {/* Status Dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="processing">قيد المعالجة</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="delivered">تم التسليم</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t dark:border-gray-700 pt-4">
                  <h4 className="font-semibold mb-3 dark:text-white">المنتجات:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 dark:text-gray-300">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {item.quantity} × {item.price} أوقية = {item.price * item.quantity} أوقية
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="border-t dark:border-gray-700 pt-4 mt-4">
                    <h4 className="font-semibold mb-2 dark:text-white">ملاحظات:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{order.notes}</p>
                  </div>
                )}

                {/* WhatsApp Button */}
                <div className="border-t dark:border-gray-700 pt-4 mt-4">
                  <a
                    href={`https://wa.me/${order.customerPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    تواصل عبر واتساب
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
