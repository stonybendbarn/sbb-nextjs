# Testimonials System Setup Guide

This guide explains the testimonials system that has been implemented for Stony Bend Barn.

## Overview

The testimonials system uses a **Hybrid Approach**:
- **Static testimonials** are ready to use immediately (in `lib/testimonials-data.ts`)
- **Database-driven testimonials** can be managed via the admin panel once the migration is run

## Features

✅ **Product Linking**: Link testimonials to specific products or product categories
✅ **Admin Management**: Full CRUD operations via admin panel
✅ **Multiple Display Locations**:
   - Homepage (featured testimonials section)
   - Product category pages (filtered by category)
   - Dedicated testimonials page (`/testimonials`)
   - Footer link for easy access

✅ **Flexible Display Options**:
   - Grid layout (homepage)
   - Default layout (testimonials page)
   - Compact layout (product pages)

✅ **Ratings Support**: Optional 1-5 star ratings
✅ **Approval System**: Control which testimonials are displayed
✅ **Featured Testimonials**: Highlight important testimonials

## Setup Instructions

### 1. Run Database Migration (Optional but Recommended)

If you want to use the database-driven system (recommended for long-term management):

```bash
node scripts/run-testimonials-migration.js
```

Or manually run the SQL in `lib/migrations/create-testimonials-table.sql` in your PostgreSQL database.

### 2. Current Static Testimonials

Two sample testimonials are already configured in `lib/testimonials-data.ts`:

1. **Sarah Johnson** - Dining Room Table (5 stars)
2. **Michael Chen** - Butcher Block Table (5 stars)

Both are linked to the "furniture" category and will appear:
- On the homepage (featured section)
- On the `/products/furniture` page
- On the `/testimonials` page

### 3. Adding More Static Testimonials

To add more static testimonials immediately, edit `lib/testimonials-data.ts`:

```typescript
{
  id: "static-3",
  customer_name: "Customer Name",
  testimonial_text: "Their testimonial here...",
  rating: 5,
  product_name: "Product Name",
  product_category: "category-slug", // e.g., "furniture", "cutting-boards"
  is_featured: true,
}
```

### 4. Using the Admin Panel

Once the migration is run, access the admin panel at:

**`/admin/testimonials`**

Features:
- Add new testimonials
- Edit existing testimonials
- Link testimonials to products (by ID, name, or category)
- Set ratings (1-5 stars)
- Mark as featured
- Approve/disable testimonials
- Control display order

### 5. Product Linking Options

When adding a testimonial, you can link it to a product in three ways:

1. **Product ID**: Use the database product ID (e.g., `abc-123`)
2. **Product Name**: Use the product name (e.g., "Dining Room Table")
3. **Product Category**: Use the category slug (e.g., `furniture`, `cutting-boards`)

The testimonial will automatically appear on the corresponding product category page if linked.

## Display Locations

### Homepage (`/`)
- Shows 2 featured testimonials in a grid layout
- Located between "Featured Products" and "CTA" sections
- Includes a link to view all testimonials

### Product Category Pages (`/products/[category]`)
- Shows up to 3 testimonials for that specific category
- Only displays if there are testimonials linked to that category
- Appears between products and the CTA section

### Dedicated Testimonials Page (`/testimonials`)
- Shows all testimonials in a default layout
- Accessible from:
  - Homepage "View All Testimonials" button
  - Footer "Testimonials" link

## Updating Testimonials

### Static Testimonials (Current)
Edit `lib/testimonials-data.ts` and the changes will appear immediately.

### Database Testimonials (After Migration)
Use the admin panel at `/admin/testimonials` to manage all testimonials.

## Database Schema

The testimonials table includes:
- `id`: Unique identifier
- `customer_name`: Customer's name (required)
- `customer_email`: Customer's email (optional)
- `testimonial_text`: The testimonial content (required)
- `rating`: Star rating 1-5 (optional)
- `product_id`: Link to product by ID (optional)
- `product_name`: Product name for display (optional)
- `product_category`: Category slug for filtering (optional)
- `is_featured`: Featured flag (boolean)
- `is_approved`: Approval flag (boolean)
- `display_order`: Order for sorting (integer)
- `created_at`: Creation timestamp
- `updated_at`: Update timestamp

## Next Steps

1. ✅ Update the sample testimonials with real customer names and quotes
2. ✅ Add more testimonials as you collect them from customers
3. (Optional) Run the database migration to enable admin panel management
4. (Optional) Set up automated testimonial collection after orders

## Tips

- **Start with Static**: The static testimonials work immediately - no database needed!
- **Collect from Past Customers**: Reach out to friends/customers who bought from you
- **Update Product Names**: Make sure product names match what's on your site
- **Category Slugs**: Use lowercase category slugs (e.g., `furniture`, not `Furniture`)
- **Featured First**: Mark your best testimonials as featured to show on homepage

## Support

For questions or issues, check:
- Admin panel at `/admin/testimonials`
- Testimonials data file at `lib/testimonials-data.ts`
- Database migration file at `lib/migrations/create-testimonials-table.sql`

