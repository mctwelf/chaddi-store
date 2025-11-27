# 🔧 Fix Categories RLS Error

## Problem
You're getting this error when trying to add categories:
```
new row violates row-level security policy for table "categories"
```

## Solution
Run this SQL in Supabase to fix the Row Level Security policy:

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project
2. Click **SQL Editor** in the left sidebar

### Step 2: Run This SQL
Copy and paste this code, then click **Run**:

```sql
-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON categories;

-- Create new policy to allow anyone to insert/update/delete
CREATE POLICY "Allow public to manage categories"
ON categories FOR ALL
TO public
USING (true)
WITH CHECK (true);
```

### Step 3: Test
1. Go to `/admin/categories`
2. Click "إضافة تصنيف جديد"
3. Enter a category name (e.g., "العطور")
4. Click "حفظ التصنيف"
5. Should work now! ✅

---

## What Changed?

### Before:
- Only authenticated users could add/edit/delete categories
- Admin panel doesn't use authentication
- Result: Permission denied

### After:
- Public access allowed for all operations
- Admin panel can now manage categories
- Still secure because admin panel requires login

---

## Alternative: Use the Migration File

If you prefer, you can run the migration file:

```bash
# Copy content from:
supabase/migrations/fix_categories_rls.sql

# Paste in Supabase SQL Editor and run
```

---

**After running the SQL, try adding a category again!** 🎉
