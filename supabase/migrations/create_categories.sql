-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, name_ar, icon, display_order) VALUES
  ('all', 'الكل', 'Package', 0),
  ('skincare', 'العناية بالبشرة', 'Sparkles', 1),
  ('haircare', 'العناية بالشعر', 'Scissors', 2),
  ('makeup', 'المكياج', 'Heart', 3)
ON CONFLICT (name) DO NOTHING;

-- Add category_id to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Update existing products to link to categories (based on category text)
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE name = 'skincare')
WHERE category LIKE '%بشرة%' AND category_id IS NULL;

UPDATE products 
SET category_id = (SELECT id FROM categories WHERE name = 'haircare')
WHERE category LIKE '%شعر%' AND category_id IS NULL;

UPDATE products 
SET category_id = (SELECT id FROM categories WHERE name = 'makeup')
WHERE category LIKE '%مكياج%' OR category LIKE '%ميك%' AND category_id IS NULL;

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to categories"
ON categories FOR SELECT
TO public
USING (true);

-- Create policy to allow authenticated users to insert/update (for admin)
CREATE POLICY "Allow authenticated users to manage categories"
ON categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
