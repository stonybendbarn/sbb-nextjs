// ================================
// app/api/stripe-webhook/route.ts
// ================================
export const runtime = "nodejs"; // Stripe signature verification requires Node runtime
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@vercel/postgres";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

// Helper: mark product Sold (only if not already)
async function markProductSold(productId: string | number) {
  const { rows } = await sql`
    UPDATE products
    SET stock_status = 'Sold'
    WHERE id = ${productId}
      AND stock_status IN ('In Stock', 'On Sale')
    RETURNING *;
  `;
  return rows[0] ?? null;
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("Missing Stripe signature header");
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;
  const rawBody = await req.text();

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const productId =
          session.client_reference_id || session.metadata?.product_id;

        if (!productId) {
          console.warn("⚠️ No productId in checkout.session.completed event");
          break;
        }

        const updated = await markProductSold(productId);
        if (updated) {
          console.log(`✅ Product ${productId} marked as Sold.`);
        } else {
          console.log(
            `ℹ️ Product ${productId} was already Sold or not found. Skipping.`
          );
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error("❌ Error processing webhook:", err);
    // Let Stripe retry if DB update fails
    return new NextResponse("Webhook handling error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}
