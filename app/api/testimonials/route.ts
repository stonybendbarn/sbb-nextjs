// app/api/testimonials/route.ts
// Public API endpoint for customer testimonial submissions

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { sendAdminTestimonialNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

// POST: Submit a new testimonial (public, requires approval)
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

    // Validation
    if (!customer_name || !testimonial_text || !rating) {
      return NextResponse.json(
        { error: "Customer name, testimonial text, and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (customer_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer_email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
    }

    // Insert testimonial with is_approved = false (requires admin approval)
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
        ${rating},
        ${product_name || null},
        ${product_category || null},
        false,
        false,
        0
      )
      RETURNING id
    `;

    // Send admin notification email (don't fail if email fails)
    try {
      await sendAdminTestimonialNotification({
        customerName: customer_name,
        customerEmail: customer_email || undefined,
        customerLocation: customer_location || undefined,
        testimonialText: testimonial_text,
        rating: rating,
        productName: product_name || undefined,
        productCategory: product_category || undefined,
        testimonialId: rows[0].id,
      });
    } catch (emailError) {
      console.error("Failed to send testimonial notification email:", emailError);
      // Don't fail the submission if email fails
    }

    return NextResponse.json({
      message: "Testimonial submitted successfully",
      testimonial: { id: rows[0].id },
    });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}

