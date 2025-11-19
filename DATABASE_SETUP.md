# 🗄️ قاعدة البيانات - Database Setup

## الخيار الموصى به: Supabase

### لماذا Supabase؟
- ✅ **مجاني** للبدء (500 MB database + 1 GB file storage)
- ✅ **PostgreSQL** قاعدة بيانات قوية وموثوقة
- ✅ **API تلقائي** - لا حاجة لكتابة كود الـ backend
- ✅ **تخزين الصور** - لصور المنتجات
- ✅ **Real-time** - تحديثات فورية
- ✅ **سهل الاستخدام** مع Next.js

---

## 📋 هيكل قاعدة البيانات

### 1. جدول المنتجات (Products)
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category TEXT NOT NULL,
  image_url TEXT,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. جدول الطلبات (Orders)
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  notes TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. جدول التصنيفات (Categories)
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. جدول العملاء (Customers) - اختياري
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  addresses JSONB,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 خطوات الإعداد

### الخطوة 1: إنشاء حساب Supabase
1. اذهب إلى: https://supabase.com
2. اضغط "Start your project"
3. سجل بحساب GitHub أو Google
4. أنشئ مشروع جديد:
   - اسم المشروع: `chaddi-store`
   - كلمة مرور قوية للـ database
   - المنطقة: اختر الأقرب (Europe West أو Middle East)

### الخطوة 2: إنشاء الجداول
1. في لوحة Supabase، اذهب إلى **SQL Editor**
2. انسخ والصق الـ SQL من الأعلى
3. اضغط **Run**

### الخطوة 3: تحميل البيانات الأولية
```sql
-- إدراج بعض المنتجات من products.json
INSERT INTO products (name, name_ar, description_ar, price, original_price, category, image_url, rating, reviews, in_stock, featured)
VALUES 
  ('Vitamin C Serum', 'سيروم فيتامين سي المضيء', 'سيروم مركز بفيتامين سي النقي يعمل على توحيد لون البشرة', 299, 399, 'العناية بالبشرة', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', 4.8, 234, true, true),
  ('Hyaluronic Acid', 'حمض الهيالورونيك المرطب', 'مرطب عميق يمنح البشرة نضارة ونعومة فائقة', 249, 349, 'العناية بالبشرة', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500', 4.9, 189, true, true);

-- إدراج التصنيفات
INSERT INTO categories (name, name_ar, description, icon)
VALUES 
  ('Skincare', 'العناية بالبشرة', 'منتجات العناية بالبشرة', 'Sparkles'),
  ('Haircare', 'العناية بالشعر', 'منتجات العناية بالشعر', 'Heart'),
  ('Makeup', 'المكياج', 'منتجات المكياج', 'Star');
```

### الخطوة 4: الحصول على API Keys
1. في Supabase، اذهب إلى **Settings** → **API**
2. انسخ:
   - `Project URL`
   - `anon public` key

---

## 📦 تثبيت Supabase في المشروع

### 1. تثبيت الحزمة
```bash
npm install @supabase/supabase-js
```

### 2. إنشاء ملف `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. إنشاء Supabase Client
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 🔄 تحديث الكود لاستخدام قاعدة البيانات

### جلب المنتجات
```typescript
// بدلاً من:
import products from '@/data/products.json'

// استخدم:
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('in_stock', true)
```

### حفظ الطلبات
```typescript
const saveOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      order_number: `ORD-${Date.now()}`,
      customer_name: orderData.name,
      customer_phone: orderData.phone,
      city: orderData.city,
      address: orderData.address,
      latitude: orderData.latitude,
      longitude: orderData.longitude,
      notes: orderData.notes,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping_cost: orderData.shippingCost,
      total: orderData.total,
      status: 'pending'
    }])
    .select()
  
  return data
}
```

---

## 🎯 الميزات المستقبلية

مع قاعدة البيانات، يمكنك إضافة:

### 1. **لوحة تحكم للمسؤول**
- عرض جميع الطلبات
- تحديث حالة الطلب (قيد المعالجة، تم الشحن، تم التسليم)
- إضافة/تعديل/حذف المنتجات
- إحصائيات المبيعات

### 2. **تتبع الطلبات**
- العميل يدخل رقم الطلب
- يرى حالة الطلب الحالية

### 3. **المفضلة**
- حفظ المنتجات المفضلة
- قائمة الرغبات

### 4. **تقييمات المنتجات**
- العملاء يضيفون تقييمات
- عرض التقييمات الحقيقية

### 5. **إدارة المخزون**
- تتبع الكميات
- تنبيهات عند نفاد المخزون

### 6. **كوبونات الخصم**
- إنشاء أكواد خصم
- تطبيق الخصومات تلقائياً

---

## 📊 مثال: لوحة تحكم بسيطة

```typescript
// app/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  
  useEffect(() => {
    fetchOrders()
  }, [])
  
  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    setOrders(data || [])
  }
  
  const updateOrderStatus = async (orderId, status) => {
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
    
    fetchOrders()
  }
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{order.order_number}</h3>
                <p>{order.customer_name} - {order.customer_phone}</p>
                <p className="text-sm text-gray-600">{order.city}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{order.total} أوقية</p>
                <select 
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="mt-2 border rounded px-2 py-1"
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="shipped">تم الشحن</option>
                  <option value="delivered">تم التسليم</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🔐 الأمان

### Row Level Security (RLS)
```sql
-- السماح للجميع بقراءة المنتجات
CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT
USING (true);

-- السماح فقط للمسؤولين بتعديل المنتجات
CREATE POLICY "Only admins can modify products"
ON products FOR ALL
USING (auth.role() = 'admin');

-- السماح للجميع بإنشاء طلبات
CREATE POLICY "Anyone can create orders"
ON orders FOR INSERT
WITH CHECK (true);

-- السماح فقط للمسؤولين برؤية جميع الطلبات
CREATE POLICY "Only admins can view all orders"
ON orders FOR SELECT
USING (auth.role() = 'admin');
```

---

## 💰 التكلفة

### Supabase Free Tier:
- ✅ 500 MB Database
- ✅ 1 GB File Storage
- ✅ 50,000 Monthly Active Users
- ✅ 2 GB Bandwidth
- ✅ مجاني للأبد!

### متى تحتاج للترقية؟
- عند تجاوز 500 MB من البيانات
- عند تجاوز 50,000 مستخدم شهرياً
- **السعر:** $25/شهر للـ Pro plan

---

## 🚀 الخطوات التالية

1. **الآن:** أنشئ حساب Supabase
2. **بعدها:** أنشئ الجداول
3. **ثم:** نثبت الحزمة ونربط المشروع
4. **أخيراً:** نحول الكود لاستخدام قاعدة البيانات

**هل تريد أن أساعدك في إعداد Supabase الآن؟** 🎯
