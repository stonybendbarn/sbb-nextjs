-- Create testimonials table for customer testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  testimonial_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  -- Product linking: can link to product_id, product_name, or product_category
  product_id VARCHAR(255),
  product_name VARCHAR(255),
  product_category VARCHAR(100),
  
  -- Display settings
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_testimonials_product_id ON testimonials(product_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_product_category ON testimonials(product_category);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);

-- Add foreign key constraint if product_id exists (optional - can be null for static testimonials)
-- CREATE INDEX IF NOT EXISTS idx_testimonials_product_fk ON testimonials(product_id);
-- Note: We're not using foreign key constraint to allow flexibility for static testimonials



