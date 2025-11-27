-- Fix Row Level Security for categories table
-- This allows public access for admin operations without authentication

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON categories;

-- Create new policy to allow anyone to insert/update/delete
CREATE POLICY "Allow public to manage categories"
ON categories FOR ALL
TO public
USING (true)
WITH CHECK (true);
