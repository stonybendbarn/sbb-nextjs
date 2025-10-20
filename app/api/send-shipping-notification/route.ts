import { NextRequest, NextResponse } from "next/server";
import { sendOrderShippedEmail, OrderDetails } from "@/lib/email";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, trackingNumber } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Get order details from database
    const { rows } = await sql`
      SELECT 
        o.id,
        o.customer_email,
        o.customer_name,
        o.subtotal_cents,
        o.shipping_cents,
        o.total_cents,
        o.shipping_address,
        o.items
      FROM orders o
      WHERE o.id = ${orderId}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = rows[0];
    
    // Data is already parsed from JSONB columns
    const shippingAddress = order.shipping_address || {};
    const items = order.items || [];

    const orderDetails: OrderDetails = {
      orderId: order.id,
      customerEmail: order.customer_email,
      customerName: order.customer_name,
      items: items,
      subtotal: order.subtotal_cents,
      shipping: order.shipping_cents,
      total: order.total_cents,
      shippingAddress: shippingAddress
    };

    // Send shipping notification
    await sendOrderShippedEmail(orderDetails, trackingNumber);

    // Update order with email tracking information
    await sql`
      UPDATE orders 
      SET 
        email_sent_at = NOW(),
        email_tracking_number = ${trackingNumber || null},
        email_status = 'sent',
        status = 'shipped',
        updated_at = NOW()
      WHERE id = ${orderId}
    `;

    return NextResponse.json({ success: true, message: "Shipping notification sent" });
  } catch (error) {
    console.error("Error sending shipping notification:", error);
    return NextResponse.json({ error: "Failed to send shipping notification" }, { status: 500 });
  }
}
