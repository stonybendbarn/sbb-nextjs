import { NextRequest, NextResponse } from "next/server";
import { sendConsolidatedShippingEmail, ConsolidatedOrderDetails } from "@/lib/email";
import { sql } from "@vercel/postgres";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderIds, trackingNumber } = body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "Order IDs array is required" }, { status: 400 });
    }

    // Get all orders in one query
    const { rows } = await sql`
      SELECT 
        o.id,
        o.customer_email,
        o.customer_name,
        o.subtotal_cents,
        o.shipping_cents,
        o.total_cents,
        o.shipping_address,
        o.items,
        o.email_sent_at,
        o.email_status
      FROM orders o
      WHERE o.id = ANY(${orderIds})
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }

    // Check if any orders have already been emailed
    const alreadyEmailed = rows.filter(order => order.email_sent_at);
    if (alreadyEmailed.length > 0) {
      const emailedIds = alreadyEmailed.map(order => order.id);
      return NextResponse.json({ 
        error: `Orders already emailed: ${emailedIds.join(', ')}` 
      }, { status: 400 });
    }

    // Group orders by customer email
    const ordersByCustomer = new Map<string, any[]>();
    for (const order of rows) {
      const email = order.customer_email;
      if (!ordersByCustomer.has(email)) {
        ordersByCustomer.set(email, []);
      }
      ordersByCustomer.get(email)!.push(order);
    }

    const results = [];
    const errors = [];

    // Process each customer's orders
    for (const [customerEmail, customerOrders] of ordersByCustomer) {
      try {
        // Parse the stored data for each order
        const processedOrders = customerOrders.map(order => ({
          orderId: order.id,
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          items: order.items || [],
          subtotal: order.subtotal_cents,
          shipping: order.shipping_cents,
          total: order.total_cents,
          shippingAddress: order.shipping_address || {}
        }));

        // Create consolidated order details
        const consolidatedDetails: ConsolidatedOrderDetails = {
          customerEmail,
          customerName: customerOrders[0].customer_name,
          orders: processedOrders,
          trackingNumber
        };

        // Send consolidated email
        await sendConsolidatedShippingEmail(consolidatedDetails);

        // Update all orders for this customer in a single transaction
        const orderIds = customerOrders.map(order => order.id);
        await sql`
          UPDATE orders 
          SET 
            email_sent_at = NOW(),
            email_tracking_number = ${trackingNumber || null},
            email_status = 'sent',
            status = 'shipped',
            updated_at = NOW()
          WHERE id = ANY(${orderIds})
        `;

        results.push({
          customerEmail,
          orderIds,
          message: `Email sent successfully to ${customerEmail} for ${orderIds.length} order(s)`
        });

        console.log(`✅ Consolidated shipping email sent to ${customerEmail} for orders: ${orderIds.join(', ')}`);

      } catch (error) {
        console.error(`❌ Failed to send email to ${customerEmail}:`, error);
        errors.push({
          customerEmail,
          orderIds: customerOrders.map(order => order.id),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Return results
    if (errors.length > 0 && results.length === 0) {
      return NextResponse.json({ 
        error: "Failed to send any emails", 
        details: errors 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed ${results.length} customer(s) successfully`,
      results,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error("Error in batch shipping notification:", error);
    return NextResponse.json({ 
      error: "Failed to process batch shipping notification" 
    }, { status: 500 });
  }
}
