-- Add default UUID generation for products.id column
ALTER TABLE products ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;

