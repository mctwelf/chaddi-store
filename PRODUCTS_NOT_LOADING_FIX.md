# 🔧 Fix: Products Not Loading

## Problem
Products are not showing up on the website (homepage, products page, etc.)

## Possible Causes & Solutions

### 1. ⚠️ No Products in Database (Most Common)

**Check:**
- Go to `/admin` page
- Look at the products list
- If empty, you need to add products!

**Solution:**
1. Go to `http://localhost:3000/admin` (or `https://chaddistore.com/admin`)
2. Click "Add Product"
3. Fill in product details:
   - Name (required)
   - Price (required)
   - Category (required)
   - Image URL (required)
   - Description
4. Click "Save"
5. Refresh homepage - products should appear

---

### 2. 🔌 Supabase Connection Issue

**Check Console Logs:**
Open browser console (F12) and look for:
- ❌ "Supabase error"
- ❌ "Error fetching products"
- ❌ Network errors

**Solution A: Check Environment Variables**

1. Verify `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hsqzcyxotfveuebqhqla.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. Restart dev server:
```bash
npm run dev
```

**Solution B: Check Supabase Dashboard**

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Check if project is paused (free tier pauses after inactivity)
4. Click "Resume" if paused

---

### 3. 🗄️ Database Table Issues

**Check Supabase Table:**

1. Go to Supabase Dashboard → Table Editor
2. Look for `products` table
3. Check if table exists and has data

**Solution: Create/Fix Products Table**

If table doesn't exist, run this SQL in Supabase SQL Editor:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  image TEXT,
  images TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Create policy to allow authenticated insert
CREATE POLICY "Allow authenticated insert" ON products
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated update
CREATE POLICY "Allow authenticated update" ON products
  FOR UPDATE USING (true);

-- Create policy to allow authenticated delete
CREATE POLICY "Allow authenticated delete" ON products
  FOR DELETE USING (true);
```

---

### 4. 🌐 Network/CORS Issues

**Check:**
- Open Network tab in browser DevTools (F12)
- Look for failed requests to `/api/products`
- Check response status (should be 200)

**Solution:**
- If 404: API route not found - check file exists at `src/app/api/products/route.ts`
- If 500: Server error - check server console logs
- If CORS: Shouldn't happen with Next.js, but restart server

---

### 5. 🔄 Cache Issues

**Solution:**
1. Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Try incognito/private window
4. Restart dev server

---

### 6. 📱 Vercel Deployment Issues

If products work locally but not on Vercel:

**Check Environment Variables on Vercel:**

1. Go to Vercel Dashboard
2. Select project → Settings → Environment Variables
3. Ensure these are set:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
4. Redeploy after adding variables

---

## Debugging Steps

### Step 1: Check Console Logs

**Open Browser Console (F12):**

Look for these messages:
```
🔍 Fetching products...
📦 Received data: [...]
✅ In-stock products: X
```

If you see:
- `📈 Length: 0` → No products in database
- `❌ Error` → Connection or API issue

**Check Server Console:**

Look for:
```
🔍 Fetching products from Supabase...
✅ Found X products
📦 Sample product: Product Name
```

If you see:
- `⚠️ No products in database!` → Add products via /admin
- `❌ Supabase error` → Check Supabase connection

### Step 2: Test API Directly

Open browser and go to:
```
http://localhost:3000/api/products
```

You should see JSON array of products:
```json
[
  {
    "id": "...",
    "name": "Product Name",
    "price": 500,
    ...
  }
]
```

If you see `[]` → No products in database
If you see error → API or database issue

### Step 3: Check Database Directly

1. Go to Supabase Dashboard
2. Table Editor → products
3. Check if rows exist
4. If no rows → Add products via /admin

---

## Quick Fix Checklist

- [ ] Check if products exist in Supabase (Table Editor)
- [ ] Check browser console for errors (F12)
- [ ] Check server console for errors
- [ ] Verify environment variables in `.env.local`
- [ ] Check Supabase project is not paused
- [ ] Test `/api/products` endpoint directly
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Restart dev server
- [ ] Add test product via /admin
- [ ] Check Vercel environment variables (if deployed)

---

## Test Product

If you need to add a test product quickly, use this via /admin:

```
Name: Test Product
Price: 500
Category: skincare
Image: https://via.placeholder.com/400
Description: This is a test product
In Stock: ✓
```

---

## Still Not Working?

### Check These Files:

1. **API Route:** `src/app/api/products/route.ts`
   - Should export GET function
   - Should connect to Supabase

2. **Supabase Client:** `src/lib/supabase.ts`
   - Should have correct URL and key
   - Should export `supabase` client

3. **Homepage:** `src/app/page.tsx`
   - Should call `fetchFeaturedProducts()`
   - Should set products state

### Enable Debug Mode:

The latest code has detailed logging. Check:
- Browser console (F12 → Console tab)
- Server terminal (where you ran `npm run dev`)

You'll see exactly where the issue is!

---

## Common Error Messages

### "No products in database"
**Fix:** Add products via /admin page

### "Supabase error: relation 'products' does not exist"
**Fix:** Create products table (see SQL above)

### "Failed to fetch"
**Fix:** Check if dev server is running, check network connection

### "CORS error"
**Fix:** Restart dev server

### "401 Unauthorized"
**Fix:** Check Supabase RLS policies (see SQL above)

---

**After following these steps, products should load! If still having issues, check the console logs - they will tell you exactly what's wrong.** 🔍
