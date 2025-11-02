// app/api/admin/testimonials/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

// PUT: Update a testimonial
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      testimonial_text,
      rating,
      product_id,
      product_name,
      product_category,
      images,
      is_featured,
      is_approved,
      display_order,
    } = body;

    // Prepare images for update - only update if provided
    let query;
    if (images !== undefined) {
      const imagesJson = JSON.stringify(Array.isArray(images) ? images : []);
      query = sql`
        UPDATE testimonials
        SET
          customer_name = COALESCE(${customer_name}, customer_name),
          customer_email = COALESCE(${customer_email}, customer_email),
          testimonial_text = COALESCE(${testimonial_text}, testimonial_text),
          rating = COALESCE(${rating}, rating),
          product_id = COALESCE(${product_id}, product_id),
          product_name = COALESCE(${product_name}, product_name),
          product_category = COALESCE(${product_category}, product_category),
          images = ${imagesJson}::jsonb,
          is_featured = COALESCE(${is_featured}, is_featured),
          is_approved = COALESCE(${is_approved}, is_approved),
          display_order = COALESCE(${display_order}, display_order),
          updated_at = NOW()
        WHERE id = ${params.id}
        RETURNING *
      `;
    } else {
      query = sql`
        UPDATE testimonials
        SET
          customer_name = COALESCE(${customer_name}, customer_name),
          customer_email = COALESCE(${customer_email}, customer_email),
          testimonial_text = COALESCE(${testimonial_text}, testimonial_text),
          rating = COALESCE(${rating}, rating),
          product_id = COALESCE(${product_id}, product_id),
          product_name = COALESCE(${product_name}, product_name),
          product_category = COALESCE(${product_category}, product_category),
          is_featured = COALESCE(${is_featured}, is_featured),
          is_approved = COALESCE(${is_approved}, is_approved),
          display_order = COALESCE(${display_order}, display_order),
          updated_at = NOW()
        WHERE id = ${params.id}
        RETURNING *
      `;
    }

    const { rows } = await query;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ testimonial: rows[0] });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

// DELETE: Delete a testimonial
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { rows } = await sql`
      DELETE FROM testimonials
      WHERE id = ${params.id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}


