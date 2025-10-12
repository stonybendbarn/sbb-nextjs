// ================================
// 1) app/api/checkout/route.ts
//    Multi item Checkout (cart or single‑item)
// ================================
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

// --- shipping discount helpers ---
const fmt = (cents: number) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });

const rawShippingDiscount = process.env.SHIPPING_DISCOUNT ?? "0";
const pctNum = Number(rawShippingDiscount);
const pct = Number.isFinite(pctNum) ? Math.min(100, Math.max(0, pctNum)) : 0;
const discountFrac = pct / 100;

function applyShippingDiscount(baseCents: number, frac: number) {
  return Math.max(0, Math.round(baseCents * (1 - frac)));
}

// --- Shipping discount (percentage in 0..100) ---
function getShippingDiscountFraction(raw: string) {
  const n = Number(raw);
  const pct = Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
  return pct / 100;
}
const SHIPPING_DISCOUNT_F = getShippingDiscountFraction(rawShippingDiscount);


type CartItem = {
  id: number | string;
  name: string;
  priceInCents: number;
  image?: string;
  shippingCents?: number; // per item shipping (optional)
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { items?: CartItem[] } | CartItem;

    // Accept either {items:[...]} or a single item for convenience
    const items: CartItem[] = Array.isArray((body as any).items)
      ? (body as any).items
      : [body as CartItem];

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Build line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((it) => ({
      price_data: {
        currency: "usd",
        unit_amount: it.priceInCents,
        product_data: {
          name: it.name,
          images: it.image ? [it.image] : [],
        },
      },
      quantity: 1, // one‑of‑a‑kind inventory
    }));

	// Compute base shipping from items (same as before)
	const baseShipCents = items.reduce((sum, it) => sum + (it.shippingCents ?? 0), 0);

	// Apply env-driven discount
	const discountedShipCents = applyShippingDiscount(baseShipCents, discountFrac);

	// Human-friendly label so Stripe shows the discount meaningfully
	let shippingLabel = "Shipping";
	if (pct >= 100) {
	  shippingLabel = `Shipping — Free (was ${fmt(baseShipCents)})`;
	} else if (pct > 0) {
	  shippingLabel = `Shipping — ${pct}% off (was ${fmt(baseShipCents)})`;
	}

	const session = await stripe.checkout.sessions.create({
	  mode: "payment",
	  line_items,
	  shipping_address_collection: { allowed_countries: ["US"] },
	  shipping_options: [
		{
		  shipping_rate_data: {
			display_name: shippingLabel,
			type: "fixed_amount",
			fixed_amount: { amount: discountedShipCents, currency: "usd" },
		  },
		},
	  ],
	  automatic_tax: { enabled: true },
	  success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
	  cancel_url: `${SITE_URL}/inventory`,
	});


    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err?.message ?? "Checkout failed" }, { status: 500 });
  }
}

