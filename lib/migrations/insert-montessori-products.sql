-- Insert Montessori products into the database
-- All products will be marked as 'Sold' and inc_products_page = true
-- Using sequential IDs starting from 1255 (last ID in database is 1254)
-- These are custom-crafted Montessori materials made to order

-- Montessori (1255-1258)
INSERT INTO products (id, name, category, size, description, price_cents, stock_status, images, inc_products_page, available_quantity, is_quantity_based, estimated_weight_lbs, length_inches, width_inches, height_inches)
VALUES 
  ('1255', 'Stackable Tables', 'montessori', 'Custom', 'Custom-crafted stackable tables designed for Montessori learning environments. Made to order with attention to educational principles and child safety.', 0, 'Sold', '["/images/montessori/stackable-tables.jpeg"]'::jsonb, true, 0, false, 15.0, 24, 24, 18),
  ('1256', 'Tee Balance Board', 'montessori', 'Custom', 'Handcrafted tee balance board designed to support child development and balance skills. Custom-crafted to order with attention to educational principles and child safety.', 0, 'Sold', '["/images/montessori/tee-balance-board-placeholder.jpeg"]'::jsonb, true, 0, false, 5.0, 24, 12, 3),
  ('1257', 'Nuts & Bolts Board', 'montessori', 'Custom', 'Educational nuts and bolts board designed to develop fine motor skills and hand-eye coordination. Custom-crafted to order with attention to educational principles and child safety.', 0, 'Sold', '["/images/montessori/tee-balance-board-placeholder.jpeg"]'::jsonb, true, 0, false, 3.0, 18, 12, 2),
  ('1258', 'Metal Inset', 'montessori', 'Custom', 'Precision-crafted metal inset designed for Montessori learning activities. Custom-made to order with attention to educational principles and child safety.', 0, 'Sold', '["/images/montessori/tee-balance-board-placeholder.jpeg"]'::jsonb, true, 0, false, 2.0, 12, 12, 1);

