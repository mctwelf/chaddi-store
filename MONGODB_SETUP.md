# 🗄️ قاعدة البيانات - MongoDB Atlas Setup

## ✅ الخيار البديل: MongoDB Atlas

### لماذا MongoDB؟
- ✅ **مجاني 100%** - 512 MB مجاناً للأبد
- ✅ **سهل الإعداد** - 5 دقائق فقط
- ✅ **NoSQL** - مرن وسريع
- ✅ **يعمل مع JSON** - مثالي لمشروعنا
- ✅ **لا يحتاج بطاقة ائتمان**

---

## 🚀 خطوات الإعداد (5 دقائق)

### الخطوة 1: إنشاء حساب MongoDB Atlas
1. اذهب إلى: https://www.mongodb.com/cloud/atlas/register
2. سجل بـ:
   - **Google Account** (الأسهل) ✅
   - أو Email عادي
3. اختر **Free Tier** (M0 Sandbox)
4. اسم المشروع: `chaddi-store`

### الخطوة 2: إنشاء Cluster
1. اختر **Cloud Provider**: AWS
2. اختر **Region**: الأقرب لك (مثلاً: Frankfurt أو Paris)
3. اسم الـ Cluster: `chaddi-cluster`
4. اضغط **Create Cluster** (يستغرق 3-5 دقائق)

### الخطوة 3: إعداد الأمان
1. **Database Access:**
   - اضغط "Add New Database User"
   - Username: `chaddi_admin`
   - Password: اختر كلمة مرور قوية (احفظها!)
   - Database User Privileges: **Read and write to any database**
   - اضغط **Add User**

2. **Network Access:**
   - اضغط "Add IP Address"
   - اختر **"Allow Access from Anywhere"** (0.0.0.0/0)
   - اضغط **Confirm**

### الخطوة 4: الحصول على Connection String
1. اضغط **Connect** على الـ cluster
2. اختر **"Connect your application"**
3. Driver: **Node.js**
4. Version: **5.5 or later**
5. انسخ الـ **Connection String**:
   ```
   mongodb+srv://chaddi_admin:<password>@chaddi-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. استبدل `<password>` بكلمة المرور الحقيقية

---

## 📦 تثبيت MongoDB في المشروع

### 1. تثبيت الحزمة
```bash
npm install mongodb mongoose
```

### 2. إنشاء ملف `.env.local`
```env
MONGODB_URI=mongodb+srv://chaddi_admin:YOUR_PASSWORD@chaddi-cluster.xxxxx.mongodb.net/chaddi-store?retryWrites=true&w=majority
```

⚠️ **مهم:** استبدل `YOUR_PASSWORD` بكلمة المرور الحقيقية!

### 3. إضافة `.env.local` إلى `.gitignore`
```bash
# .gitignore
.env.local
.env*.local
```

---

## 🔧 إنشاء الاتصال بقاعدة البيانات

### ملف: `lib/mongodb.ts`
```typescript
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
```

### إضافة Type للـ Global
```typescript
// global.d.ts (أنشئ هذا الملف في الجذر)
import mongoose from 'mongoose'

declare global {
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

export {}
```

---

## 📋 إنشاء Models (الجداول)

### 1. Product Model
```typescript
// models/Product.ts
import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  originalPrice: Number,
  category: {
    type: String,
    required: true,
  },
  image: String,
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // يضيف createdAt و updatedAt تلقائياً
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
```

### 2. Order Model
```typescript
// models/Order.ts
import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: String,
  latitude: Number,
  longitude: Number,
  notes: String,
  items: [{
    id: Number,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  whatsappSent: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
```

---

## 🔄 إنشاء API Routes

### 1. جلب المنتجات
```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET() {
  try {
    await connectDB()
    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
```

### 2. حفظ الطلبات
```typescript
// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    
    // إنشاء رقم طلب فريد
    const orderNumber = `ORD-${Date.now()}`
    
    const order = await Order.create({
      orderNumber,
      customerName: body.name,
      customerPhone: body.phone,
      city: body.city,
      address: body.address,
      latitude: body.latitude,
      longitude: body.longitude,
      notes: body.notes,
      items: body.items,
      subtotal: body.subtotal,
      shippingCost: body.shippingCost,
      total: body.total,
      status: 'pending',
    })
    
    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const orders = await Order.find().sort({ createdAt: -1 })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
```

---

## 🔄 تحديث الكود الحالي

### 1. تحديث صفحة المنتجات
```typescript
// app/products/page.tsx
'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchProducts()
  }, [])
  
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
  
  if (loading) {
    return <div className="text-center py-20">جاري التحميل...</div>
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-12 text-center">
        <span className="gradient-text">جميع المنتجات</span>
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

### 2. تحديث صفحة الدفع - حفظ الطلب
```typescript
// في app/checkout/page.tsx
// أضف هذه الدالة:

const saveOrderToDatabase = async (orderData: any) => {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('Order saved:', result.order.orderNumber)
      return result.order
    }
  } catch (error) {
    console.error('Error saving order:', error)
  }
}

// في handleSubmit، قبل إرسال الواتساب:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const isFreeShipping = cartTotal >= 1000
  
  // حفظ الطلب في قاعدة البيانات
  const orderData = {
    name: formData.name,
    phone: formData.phone,
    city: formData.city,
    address: formData.address,
    latitude: formData.latitude,
    longitude: formData.longitude,
    notes: formData.notes,
    items: cart,
    subtotal: cartTotal,
    shippingCost: isFreeShipping ? 0 : null,
    total: cartTotal,
  }
  
  const savedOrder = await saveOrderToDatabase(orderData)
  
  // ثم إرسال الواتساب
  sendWhatsAppOrder()
  
  // عرض رسالة النجاح
  setOrderPlaced(true)
  
  // مسح السلة
  setTimeout(() => {
    clearCart()
  }, 3000)
}
```

---

## 📊 تحميل المنتجات الأولية

### سكريبت لتحميل products.json إلى MongoDB
```typescript
// scripts/seed-products.ts
import mongoose from 'mongoose'
import Product from '../models/Product'
import productsData from '../src/data/products.json'

const MONGODB_URI = 'YOUR_MONGODB_URI_HERE'

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')
    
    // مسح المنتجات القديمة
    await Product.deleteMany({})
    console.log('Cleared old products')
    
    // إضافة المنتجات الجديدة
    await Product.insertMany(productsData)
    console.log(`Added ${productsData.length} products`)
    
    console.log('✅ Seeding completed!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()
```

### تشغيل السكريبت
```bash
# أضف في package.json:
"scripts": {
  "seed": "ts-node scripts/seed-products.ts"
}

# ثم شغّل:
npm run seed
```

---

## 🎯 لوحة تحكم بسيطة

```typescript
// app/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchOrders()
  }, [])
  
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <div>جاري التحميل...</div>
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم - الطلبات</h1>
      
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {order.customerName} - {order.customerPhone}
                </p>
                <p className="text-sm text-gray-500">{order.city}</p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleString('ar-MR')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {order.total} أوقية
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2">المنتجات:</h4>
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                  • {item.name} × {item.quantity} = {item.price * item.quantity} أوقية
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## ✅ الخطوات التالية

1. ✅ **أنشئ حساب MongoDB Atlas** (5 دقائق)
2. ✅ **انسخ Connection String**
3. ✅ **أخبرني عندما تنتهي** وسأساعدك في:
   - تثبيت الحزم
   - إنشاء الملفات
   - تحميل المنتجات
   - تشغيل المشروع

**جاهز؟ أخبرني عندما تنشئ الحساب وتحصل على Connection String!** 🚀
