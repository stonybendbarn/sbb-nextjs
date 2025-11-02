// app/api/admin/testimonials/route.ts

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

// GET: Fetch all testimonials
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        id, customer_name, customer_email, testimonial_text, rating,
        product_id, product_name, product_category, images,
        is_featured, is_approved, display_order,
        created_at, updated_at
      FROM testimonials
      ORDER BY display_order ASC, created_at DESC
    `;

    return NextResponse.json({ testimonials: rows });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

// POST: Create a new testimonial
export async function POST(req: NextRequest) {
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
      images = [],
      is_featured = false,
      is_approved = true,
      display_order = 0,
    } = body;

    if (!customer_name || !testimonial_text) {
      return NextResponse.json(
        { error: "Customer name and testimonial text are required" },
        { status: 400 }
      );
    }

    const { rows } = await sql`
      INSERT INTO testimonials (
        customer_name, customer_email, testimonial_text, rating,
        product_id, product_name, product_category, images,
        is_featured, is_approved, display_order
      ) VALUES (
        ${customer_name},
        ${customer_email || null},
        ${testimonial_text},
        ${rating || null},
        ${product_id || null},
        ${product_name || null},
        ${product_category || null},
        ${JSON.stringify(images || [])},
        ${is_featured},
        ${is_approved},
        ${display_order}
      )
      RETURNING *
    `;

    return NextResponse.json({ testimonial: rows[0] });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}


