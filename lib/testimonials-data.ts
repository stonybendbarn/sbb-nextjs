// lib/testimonials-data.ts
// Static testimonials data - can be replaced with database queries later
import { Testimonial } from "@/components/testimonials";
import { sql } from "@vercel/postgres";

// This is the static data for immediate use
// Later, you can fetch from database and merge with this
export const staticTestimonials: Testimonial[] = [
  // Add static testimonials here as you collect them
  // Example:
  // {
  //   id: "static-1",
  //   customer_name: "Dolores",
  //   testimonial_text: "The coasters are beautiful...",
  //   rating: 5,
  //   product_id: "7",
  //   product_name: "Canary Coasters",
  //   product_category: "coasters",
  //   is_featured: true,
  //   customer_location: "Lima, NY",
  // },
];

// Fetch testimonials from database and merge with static testimonials
export async function fetchTestimonials(): Promise<Testimonial[]> {
  let dbTestimonials: Testimonial[] = [];
  
  try {
    const { rows } = await sql`
      SELECT 
        id, customer_name, customer_email, customer_location, testimonial_text, rating,
        product_id, product_name, product_category, images,
        is_featured, is_approved, display_order,
        created_at, updated_at
      FROM testimonials
      WHERE is_approved = true
      ORDER BY display_order ASC, created_at DESC
    `;
    
    // Fetch product images for testimonials with product_id
    const productIds = [...new Set(rows.filter((r) => r.product_id).map((r) => r.product_id))];
    const productImagesMap = new Map<string, string[]>();
    
    if (productIds.length > 0) {
      try {
        // Fetch products one at a time to get their images
        for (const productId of productIds) {
          try {
            const productResult = await sql`
              SELECT id, images
              FROM products
              WHERE id = ${productId}
            `;
            
            if (productResult.rows.length > 0) {
              const product = productResult.rows[0];
              if (product.images && Array.isArray(product.images)) {
                productImagesMap.set(String(product.id), product.images);
              }
            }
          } catch (err) {
            // Skip this product if there's an error
            console.error(`Error fetching product ${productId}:`, err);
          }
        }
      } catch (error) {
        console.error("Error fetching product images:", error);
        // Continue without product images
      }
    }
    
    dbTestimonials = rows.map((row) => {
      const testimonialImages = row.images && Array.isArray(row.images) ? row.images : [];
      const productImages = row.product_id ? (productImagesMap.get(String(row.product_id)) || []) : [];
      
      return {
        id: row.id,
        customer_name: row.customer_name,
        customer_email: row.customer_email || undefined,
        customer_location: row.customer_location || undefined,
        testimonial_text: row.testimonial_text,
        rating: row.rating || undefined,
        product_id: row.product_id || undefined,
        product_name: row.product_name || undefined,
        product_category: row.product_category || undefined,
        images: testimonialImages.length > 0 ? testimonialImages : undefined,
        product_images: productImages.length > 0 ? productImages : undefined,
        is_featured: row.is_featured || false,
        display_order: row.display_order || 0,
        created_at: row.created_at,
      };
    });
  } catch (error) {
    console.error("Error fetching testimonials from database:", error);
    // Continue with static testimonials if database fails
  }
  
  // Merge database and static testimonials
  const allTestimonials = [...staticTestimonials, ...dbTestimonials];
  
  // Filter out any invalid testimonials (missing required fields)
  const validTestimonials = allTestimonials.filter((t) => 
    t.id && 
    t.customer_name && 
    t.testimonial_text
  );
  
  // Sort by display_order (lower numbers first), then by is_featured, then by created_at
  return validTestimonials.sort((a, b) => {
    // First priority: display_order (lower numbers appear first)
    const orderA = (a as any).display_order ?? 999;
    const orderB = (b as any).display_order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    
    // Second priority: Featured items first (within same display_order)
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    
    // Third priority: Newest first (within same display_order and featured status)
    if (a.created_at && b.created_at) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });
}

// Helper function to get testimonials by product category
export function getTestimonialsByCategory(
  category: string,
  testimonials: Testimonial[]
): Testimonial[] {
  const categoryLower = category.toLowerCase();
  return testimonials.filter((t) => {
    if (!t.product_category) return false;
    const testimonialCategory = t.product_category.toLowerCase();
    // Match exact slug or convert and match
    return testimonialCategory === categoryLower || 
           testimonialCategory.replace(/\s+/g, "-") === categoryLower ||
           categoryLower.replace(/-/g, "") === testimonialCategory.replace(/\s+/g, "");
  });
}

// Helper function to get testimonials by product name
export function getTestimonialsByProductName(
  productName: string,
  testimonials: Testimonial[]
): Testimonial[] {
  return testimonials.filter(
    (t) => t.product_name?.toLowerCase() === productName.toLowerCase()
  );
}
