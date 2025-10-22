// ================================
// app/api/stripe-webhook/route.ts
// ================================
export const runtime = "nodejs"; // Stripe signature verification requires Node runtime
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sql } from "@vercel/postgres";
import { sendOrderConfirmationEmail, sendAdminOrderNotification, OrderDetails, OrderItem } from "@/lib/email";

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

// Helper: handle quantity-based inventory updates
async function updateProductQuantity(productId: string | number, quantityPurchased: number) {
  const { rows } = await sql`
    UPDATE products
    SET available_quantity = available_quantity - ${quantityPurchased},
        stock_status = CASE 
          WHEN (available_quantity - ${quantityPurchased}) <= 0 THEN 'sold out'
          ELSE stock_status 
        END
    WHERE id = ${productId}
      AND is_quantity_based = true
      AND available_quantity >= ${quantityPurchased}
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
        
        // Get the line items from the session to find all purchased products
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        
        if (!lineItems.data.length) {
          console.warn("⚠️ No line items found in checkout session");
          break;
        }

        // Extract product IDs and build order details
        const productIds: string[] = [];
        const orderItems: OrderItem[] = [];
        let subtotal = 0;

        for (const item of lineItems.data) {
          if (item.price?.product && typeof item.price.product === 'string') {
            // Get the product details to find our internal product ID
            const stripeProduct = await stripe.products.retrieve(item.price.product);
            const internalProductId = stripeProduct.metadata?.internal_product_id;
            
            if (internalProductId) {
              productIds.push(internalProductId);
              
              // Get product details from our database
              const { rows } = await sql`
                SELECT id, name, price_cents, sale_price_cents
                FROM products
                WHERE id = ${internalProductId}
              `;
              
              if (rows.length > 0) {
                const product = rows[0];
                const effectivePrice = product.sale_price_cents ?? product.price_cents;
                const quantity = item.quantity || 1;
                
                orderItems.push({
                  id: internalProductId,
                  name: product.name,
                  price_cents: effectivePrice,
                  quantity: quantity
                });
                
                subtotal += effectivePrice * quantity;
              }
            }
          }
        }

        if (productIds.length === 0) {
          console.warn("⚠️ No internal product IDs found in line items");
          break;
        }

        // Update inventory for all products
        for (const item of lineItems.data) {
          if (item.price?.product && typeof item.price.product === 'string') {
            const stripeProduct = await stripe.products.retrieve(item.price.product);
            const internalProductId = stripeProduct.metadata?.internal_product_id;
            const quantity = item.quantity || 1;
            
            if (internalProductId) {
              // Check if it's a quantity-based item
              const { rows } = await sql`
                SELECT is_quantity_based FROM products WHERE id = ${internalProductId}
              `;
              
              if (rows.length > 0 && rows[0].is_quantity_based) {
                // Handle quantity-based item
                const updated = await updateProductQuantity(internalProductId, quantity);
                if (updated) {
                  console.log(`✅ Product ${internalProductId} quantity decremented by ${quantity}. Remaining: ${updated.available_quantity}`);
                } else {
                  console.log(`❌ Failed to update quantity for product ${internalProductId}`);
                }
              } else {
                // Handle unique item (mark as sold)
                const updated = await markProductSold(internalProductId);
                if (updated) {
                  console.log(`✅ Product ${internalProductId} marked as Sold.`);
                } else {
                  console.log(`ℹ️ Product ${internalProductId} was already Sold or not found. Skipping.`);
                }
              }
            }
          }
        }

        // Store order details and send emails if we have customer information
        if (session.customer_email && session.shipping_details?.address) {
          const shipping = session.amount_total! - session.amount_subtotal!;
          const total = session.amount_total!;
          
          const orderDetails: OrderDetails = {
            orderId: session.id,
            customerEmail: session.customer_email,
            customerName: session.shipping_details.name || 'Customer',
            items: orderItems,
            subtotal: session.amount_subtotal!,
            shipping: shipping,
            total: total,
            shippingAddress: {
              line1: session.shipping_details.address.line1,
              line2: session.shipping_details.address.line2 || undefined,
              city: session.shipping_details.address.city,
              state: session.shipping_details.address.state,
              postal_code: session.shipping_details.address.postal_code,
              country: session.shipping_details.address.country,
            }
          };

          try {
            // Store order in database
            await sql`
              INSERT INTO orders (
                id, customer_email, customer_name, subtotal_cents, 
                shipping_cents, total_cents, shipping_address, items, status
              ) VALUES (
                ${session.id},
                ${session.customer_email},
                ${session.shipping_details.name || 'Customer'},
                ${session.amount_subtotal!},
                ${shipping},
                ${total},
                ${JSON.stringify(orderDetails.shippingAddress)},
                ${JSON.stringify(orderItems)},
                'pending'
              )
              ON CONFLICT (id) DO UPDATE SET
                customer_email = EXCLUDED.customer_email,
                customer_name = EXCLUDED.customer_name,
                subtotal_cents = EXCLUDED.subtotal_cents,
                shipping_cents = EXCLUDED.shipping_cents,
                total_cents = EXCLUDED.total_cents,
                shipping_address = EXCLUDED.shipping_address,
                items = EXCLUDED.items,
                updated_at = NOW()
            `;

            // Send order confirmation to customer
            await sendOrderConfirmationEmail(orderDetails);
            
            // Send notification to admin
            await sendAdminOrderNotification(orderDetails);
            
            console.log(`✅ Order stored and confirmation emails sent for order ${session.id}`);
          } catch (emailError) {
            console.error("❌ Failed to send order emails:", emailError);
            // Don't fail the webhook if email fails
          }
        } else {
          console.warn("⚠️ Missing customer email or shipping details, skipping order storage and email notifications");
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
