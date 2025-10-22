-- Add quantity fields to products table for quantity-based inventory
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS available_quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_quantity_based BOOLEAN DEFAULT false;

-- Update existing products to have quantity 1 (they're all unique items)
UPDATE products 
SET available_quantity = 1, is_quantity_based = false 
WHERE available_quantity IS NULL;

-- Add index for performance on quantity-based queries
CREATE INDEX IF NOT EXISTS idx_products_quantity_based ON products(is_quantity_based);
CREATE INDEX IF NOT EXISTS idx_products_available_quantity ON products(available_quantity);
