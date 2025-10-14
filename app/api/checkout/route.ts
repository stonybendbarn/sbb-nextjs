// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Optional knobs (all optional)
const FREE_SHIP_THRESHOLD_CENTS = Number(process.env.FREE_SHIP_THRESHOLD_CENTS ?? 50000); // e.g. 20000 for $200
const SHIPPING_DISCOUNT_PERCENT = Number(process.env.SHIPPING_DISCOUNT_PERCENT ?? 0); // e.g. 20 for 20% off shipping
const ALLOWED_COUNTRIES = (process.env.SHIP_TO_COUNTRIES ?? "US").split(",").map(s => s.trim().toUpperCase());

function effectivePriceCents(price_cents: number, sale_price_cents: number | null) {
  return (sale_price_cents ?? price_cents) || 0;
}

function defaultShippingForCategory(category: string): number {
  // Fallbacks if DB shipping_cents is null
  switch ((category || "").toLowerCase()) {
    case "cutting-boards": return 5000;   // $50.00 (example)
    case "cheese-boards":  return 2500;   // $25.00
    case "coasters":       return 1200;   // $12.00
    case "bar-ware":       return 1500;   // $15.00
    case "furniture":      return 15000;  // $150.00
    default:               return 2000;   // $20.00
  }
}

function applyShippingDiscount(base: number): number {
  if (!SHIPPING_DISCOUNT_PERCENT) return base;
  const discounted = Math.round(base * (1 - SHIPPING_DISCOUNT_PERCENT / 100));
  return Math.max(0, discounted);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const productId = String(body.productId); // your products.id is TEXT

    if (!productId) {
      return new NextResponse("Missing productId", { status: 400 });
    }

    // Load the product
    const { rows } = await sql/*sql*/`
      SELECT id, name, category, price_cents, sale_price_cents, stock_status, images, shipping_cents
      FROM products
      WHERE id = ${productId}
      LIMIT 1;
    `;
    if (!rows.length) return new NextResponse("Product not found", { status: 404 });

    const p = rows[0] as {
      id: string; // TEXT
      name: string;
      category: string;
      price_cents: number;
      sale_price_cents: number | null;
      stock_status: string | null;
      images?: string[] | null;
      shipping_cents: number | null;
    };

    if ((p.stock_status || "").toLowerCase() === "sold") {
      return new NextResponse("Product already sold", { status: 409 });
    }

    // Effective merchandise price
    const itemAmount = effectivePriceCents(p.price_cents, p.sale_price_cents);
    if (itemAmount <= 0) return new NextResponse("Invalid price", { status: 422 });

    // Compute base shipping for this item
    const baseShip = p.shipping_cents ?? defaultShippingForCategory(p.category);
    const discountedShip = applyShippingDiscount(baseShip);

    // Free shipping if threshold met
    const finalShip = itemAmount >= FREE_SHIP_THRESHOLD_CENTS ? 0 : discountedShip;

    // Stripe Checkout config
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: p.id, // TEXT is fine
      metadata: {
        product_id: p.id,
        category: p.category,
      },
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/inventory`,

      // Collect address for shipping labels and tax rules (if you enable Automatic Tax later)
      shipping_address_collection: { allowed_countries: ALLOWED_COUNTRIES as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] },

      // Offer exactly one shipping option whose amount we computed server-side.
      // You can add more options (e.g., Expedited) by pushing another shipping_rate_data block.
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: finalShip, currency: "usd" },
            display_name: finalShip === 0 ? "Free Shipping" : "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],

      // Allow promo codes (optional)
      allow_promotion_codes: true,

      // The product line item (1 qty). Use absolute image URL if you want it to show on Stripe’s page.
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: itemAmount,
            product_data: {
              name: p.name,
              // images: p.images?.length ? [`${BASE_URL}${p.images[0]}`] : undefined,
            },
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e) {
    console.error("Checkout POST error:", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
