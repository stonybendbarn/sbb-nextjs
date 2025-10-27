-- Add inc_products_page flag to control which products show on category pages
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS inc_products_page BOOLEAN DEFAULT false;

-- Add index for performance on filtering for products page
CREATE INDEX IF NOT EXISTS idx_products_inc_products_page ON products(inc_products_page);

