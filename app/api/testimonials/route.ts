// app/api/testimonials/route.ts
// Public API endpoint for customers to submit testimonials

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

// POST: Submit a new testimonial (public endpoint)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_location,
      testimonial_text,
      rating,
      product_name,
      product_category,
    } = body;

    // Validate required fields
    if (!customer_name || !testimonial_text) {
      return NextResponse.json(
        { error: "Name and testimonial text are required" },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Insert testimonial with is_approved set to false by default (requires admin approval)
    const { rows } = await sql`
      INSERT INTO testimonials (
        customer_name, customer_email, customer_location, testimonial_text, rating,
        product_name, product_category,
        is_featured, is_approved, display_order
      ) VALUES (
        ${customer_name},
        ${customer_email || null},
        ${customer_location || null},
        ${testimonial_text},
        ${rating || null},
        ${product_name || null},
        ${product_category || null},
        false,
        false,
        0
      )
      RETURNING id, customer_name, testimonial_text, created_at
    `;

    return NextResponse.json({ 
      success: true,
      message: "Thank you for your testimonial! It will be reviewed before being published.",
      testimonial: rows[0] 
    }, { status: 201 });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    return NextResponse.json({ 
      error: "Failed to submit testimonial. Please try again later." 
    }, { status: 500 });
  }
}

