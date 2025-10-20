import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        id, customer_email, customer_name, subtotal_cents, 
        shipping_cents, total_cents, shipping_address, items, 
        status, tracking_number, email_sent_at, email_status, 
        email_tracking_number, created_at
      FROM orders
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ orders: rows });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
