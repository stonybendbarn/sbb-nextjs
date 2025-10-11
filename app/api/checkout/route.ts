// app/api/checkout/route.ts
export const runtime = "nodejs";        // ensure Node runtime (Stripe SDK needs Node)
export const dynamic = "force-dynamic"; // don't cache this route

import { NextResponse } from "next/server";
import Stripe from "stripe";

// Secret key MUST be set in Vercel env (Project → Settings → Environment Variables)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

if (!STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

type Body = {
  name: string;
  priceInCents: number;   // e.g., 22500
  productId: number | string;
  image?: string;         // full URL recommended for Stripe images
  shipTier?: "small" | "board" | "pickup";
};

export async function POST(req: Request) {
  try {
    const { name, priceInCents, productId, image, shipTier }: Body = await req.json();

    if (!name || !priceInCents || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Map tier → shipping amount (cents)
    // - small items (coasters/cheese boards): $15
    // - boards/furniture: $50
    // - pickup: $0
    const shippingAmount =
      shipTier === "small" ? 1500 :
      shipTier === "pickup" ? 0 :
      5000; // default: board

    const lineItem = {
      price_data: {
        currency: "usd",
        unit_amount: priceInCents,
        product_data: {
          name,
          // Stripe recommends absolute URLs for images
          images: image ? [image] : [],
        },
      },
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItem],
      // Collect address (needed for shipping + tax)
      shipping_address_collection: { allowed_countries: ["US"] },

      // Offer two options: insured shipping (tiered) and free local pickup
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Insured Ground (3–5 business days)",
            type: "fixed_amount",
            fixed_amount: { amount: shippingAmount, currency: "usd" },
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            display_name: "Local pickup (Wake Forest, NC)",
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
          },
        },
      ],

      // Let Stripe Tax handle shipping tax rules where required
      automatic_tax: { enabled: true },

      // Where to send the buyer
      success_url: `${SITE_URL}/success?pid=${encodeURIComponent(String(productId))}`,
      cancel_url: `${SITE_URL}/inventory`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Checkout failed" },
      { status: 500 }
    );
  }
}
