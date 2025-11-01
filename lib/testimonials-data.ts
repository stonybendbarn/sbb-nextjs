// lib/testimonials-data.ts
// Static testimonials data - can be replaced with database queries later
import { Testimonial } from "@/components/testimonials";
import { sql } from "@vercel/postgres";

// This is the static data for immediate use
// Later, you can fetch from database and merge with this
export const staticTestimonials: Testimonial[] = [
  {
    id: "static-1",
    customer_name: "Dolores",
    testimonial_text:
      "The coasters are beautiful. I play cards and the one coaster had a diamond shape that really caught my eye. The others are great too!",
    rating: 5,
    product_id: "7",
    product_name: "Canary Coasters",
    product_category: "coasters",
    is_featured: true,
  },
  // Add more static testimonials here as you collect them
];

// Fetch testimonials from database and merge with static testimonials
export async function fetchTestimonials(): Promise<Testimonial[]> {
  let dbTestimonials: Testimonial[] = [];
  
  try {
    const { rows } = await sql`
      SELECT 
        id, customer_name, customer_email, testimonial_text, rating,
        product_id, product_name, product_category,
        is_featured, is_approved, display_order,
        created_at, updated_at
      FROM testimonials
      WHERE is_approved = true
      ORDER BY display_order ASC, created_at DESC
    `;
    
    dbTestimonials = rows.map((row) => ({
      id: row.id,
      customer_name: row.customer_name,
      customer_email: row.customer_email || undefined,
      testimonial_text: row.testimonial_text,
      rating: row.rating || undefined,
      product_id: row.product_id || undefined,
      product_name: row.product_name || undefined,
      product_category: row.product_category || undefined,
      is_featured: row.is_featured || false,
      created_at: row.created_at,
    }));
  } catch (error) {
    console.error("Error fetching testimonials from database:", error);
    // Continue with static testimonials if database fails
  }
  
  // Merge database and static testimonials
  // Static testimonials come first, then database testimonials
  // You can adjust this ordering if needed
  const allTestimonials = [...staticTestimonials, ...dbTestimonials];
  
  // Sort by display_order (static ones have no display_order, so they'll appear first)
  // Then by is_featured, then by created_at
  return allTestimonials.sort((a, b) => {
    // Featured items first
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    
    // Then by display_order if available (lower numbers first)
    // Static testimonials don't have display_order, so they'll be after featured DB ones
    const orderA = ('display_order' in a && typeof a.display_order === 'number') ? a.display_order : 999;
    const orderB = ('display_order' in b && typeof b.display_order === 'number') ? b.display_order : 999;
    if (orderA !== orderB) return orderA - orderB;
    
    // Finally by created_at (newest first)
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
