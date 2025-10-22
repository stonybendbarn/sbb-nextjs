// app/api/checkout/route.ts - updated
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-09-30.clover" });
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const isHttpsPublic = BASE_URL.startsWith("https://");

// Optional knobs (all optional)
const FREE_SHIP_THRESHOLD_CENTS = Number(process.env.FREE_SHIP_THRESHOLD_CENTS ?? 50000); // e.g. 20000 for $200
const SHIPPING_DISCOUNT_PERCENT = Number(process.env.SHIPPING_DISCOUNT ?? 0); // e.g. 20 for 20% off shipping
// Allowed countries for address collection (e.g., SHIP_TO_COUNTRIES="US,CA")
const ALLOWED_COUNTRIES = (process.env.SHIP_TO_COUNTRIES ?? "US")
  .split(",")
  .map(s => s.trim().toUpperCase())
  .filter(Boolean) as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[];

function toAbsoluteUrl(src?: string | null) {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  const base = BASE_URL.replace(/\/+$/, "");
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${base}${path}`;
}

function effectivePriceCents(price_cents: number, sale_price_cents: number | null) {
  return (sale_price_cents ?? price_cents) || 0;
}

function toAbsoluteUrlOld(src?: string | null): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;       // already absolute
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${base}${path}`;
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

function getOrigin(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return new URL(req.url).origin;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

	// Load the product (we'll support single-item checkout for now)
	// --- Cart-aware checkout: fetch all items in the request ---
	const ids: string[] = Array.isArray(body?.items)
	  ? body.items.map((i: { id: string }) => String(i.id))
	  : body?.productId
		? [String(body.productId)]
		: [];

	// Create a map of item IDs to quantities
	const itemQuantities: Record<string, number> = {};
	if (Array.isArray(body?.items)) {
	  body.items.forEach((i: { id: string; qty: number }) => {
		itemQuantities[String(i.id)] = i.qty || 1;
	  });
	} else if (body?.productId) {
	  itemQuantities[String(body.productId)] = 1;
	}

	if (!ids.length) {
	  return NextResponse.json({ error: "No items to purchase" }, { status: 400 });
	}

	// Pull all products with shipping dimensions
	const { rows } = await sql`
	  SELECT
		id,
		name,
		category,
		price_cents,
		sale_price_cents,
		stock_status,
		images,
		shipping_cents,
		estimated_weight_lbs,
		length_inches,
		width_inches,
		height_inches
	  FROM products
	  WHERE id = ANY(${ids})
	`;

	// Build product line_items and compute per-item shipping
	const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
	let shipping_total_cents = 0;

	// Track order subtotal for free-shipping threshold
	let orderSubtotalCents = 0;

	for (const row of rows as Array<{
	  id: string;
	  name: string;
	  category: string;
	  price_cents: number;
	  sale_price_cents: number | null;
	  stock_status: string | null;
	  images?: string[] | null;
	  shipping_cents: number | null;
	  estimated_weight_lbs: number;
	  length_inches: number;
	  width_inches: number;
	  height_inches: number;
	}>) {
	  const sold = (row.stock_status || "").toLowerCase() === "sold";
	  if (sold) continue;

	  const unit_amount = (row.sale_price_cents ?? row.price_cents) || 0;
	  const quantity = itemQuantities[String(row.id)] || 1;
	  const line_total = unit_amount * quantity;
	  
	  orderSubtotalCents += line_total;
	  if (unit_amount <= 0) continue;

	  const imageUrl = isHttpsPublic ? toAbsoluteUrl(row.images?.[0]) : undefined;

	  line_items.push({
		quantity: quantity,
		price_data: {
		  currency: "usd",
		  unit_amount,
		  product_data: {
			name: row.name,
			images: imageUrl ? [imageUrl] : undefined,
			metadata: {
			  internal_product_id: String(row.id),
			},
		  },
		},
	  });

	  // Collect products for Shippo calculation (will calculate after loop)
	} // <-- CLOSE THE LOOP ✅

	// Use calculated shipping if provided, otherwise use current system
	if (body.calculatedShipping !== undefined) {
	  // Use the calculated shipping from the cart page
	  shipping_total_cents = Math.round(body.calculatedShipping * 100); // Convert dollars to cents
	  console.log('Using calculated shipping:', body.calculatedShipping, 'cents:', shipping_total_cents);
	} else {
	  // Use your current shipping system for checkout
	  for (const row of rows) {
		if ((row.stock_status || "").toLowerCase() === "sold") continue;
		const baseShip = row.shipping_cents ?? defaultShippingForCategory(row.category);
		const discountedShip = applyShippingDiscount(baseShip);
		shipping_total_cents += Math.max(0, discountedShip);
	  }
	}

	// Order-level free-shipping threshold (apply after summing everything)
	if (FREE_SHIP_THRESHOLD_CENTS > 0 && orderSubtotalCents >= FREE_SHIP_THRESHOLD_CENTS) {
	  shipping_total_cents = 0;
	}

	// Do NOT add a "Shipping" line item when using shipping_options
	// (the hosted Checkout will render shipping from shipping_options)
	if (!line_items.length) {
	  return NextResponse.json({ error: "All selected items are unavailable" }, { status: 409 });
	}

	const origin = getOrigin(req);

	const shippingLabel = shipping_total_cents === 0
	  ? "Free shipping"
	  : (SHIPPING_DISCOUNT_PERCENT > 0
		  ? `Shipping (${SHIPPING_DISCOUNT_PERCENT}% off)`
		  : "Shipping");

	// Always show both local pickup and shipping options
	const shippingOptions = [
		// Local pickup option
		{
		  shipping_rate_data: {
			type: "fixed_amount",
			fixed_amount: { amount: 0, currency: "usd" },
			display_name: "Local pickup",
		  },
		},
		// Shipping option (calculated or standard)
		{
		  shipping_rate_data: {
			type: "fixed_amount",
			fixed_amount: { amount: shipping_total_cents, currency: "usd" },
			display_name: body.calculatedShipping !== undefined ? "Shipping" : shippingLabel,
			delivery_estimate: {
			  minimum: { unit: "business_day", value: 3 },
			  maximum: { unit: "business_day", value: 7 },
			},
		  },
		},
	];

	// Create the session
	const session = await stripe.checkout.sessions.create({
	  mode: "payment",
	  line_items,
	  // Enable Stripe Tax
	  automatic_tax: { enabled: true },
	  success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
	  cancel_url: `${origin}/cart?canceled=1`,
	  shipping_options: shippingOptions,
	  shipping_address_collection: { allowed_countries: ALLOWED_COUNTRIES },
	  allow_promotion_codes: true,
	});

	return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (e) {
    console.error("Checkout POST error:", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
