-- Insert sample testimonials for testing
-- These match the static testimonials in lib/testimonials-data.ts

-- Testimonial 1: Brian M - Butcher Block Table
INSERT INTO testimonials (
  customer_name,
  customer_email,
  testimonial_text,
  rating,
  product_id,
  product_name,
  product_category,
  is_featured,
  is_approved,
  display_order
) VALUES (
  'Brian M',
  NULL, -- Add email if available
  'The butcher block table exceeded all expectations. The quality of the wood and attention to detail is outstanding. It''s both beautiful and functional - exactly what we were looking for.',
  5,
  '1237',
  'Butcher Block Table',
  'furniture',
  true,
  true,
  1
);

-- Testimonial 2: Jane M - Dining Room Table
INSERT INTO testimonials (
  customer_name,
  customer_email,
  testimonial_text,
  rating,
  product_id,
  product_name,
  product_category,
  is_featured,
  is_approved,
  display_order
) VALUES (
  'Jane M',
  NULL, -- Add email if available
  'We absolutely love our dining room table! The craftsmanship is exceptional and it''s become the centerpiece of our home. Bill was so easy to work with throughout the entire custom process.',
  5,
  '1238',
  'Dining Room Table',
  'furniture',
  true,
  true,
  2
);



