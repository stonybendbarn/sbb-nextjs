import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface OrderItem {
  id: string;
  name: string;
  price_cents: number;
  quantity: number;
}

export interface OrderDetails {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export async function sendOrderConfirmationEmail(orderDetails: OrderDetails) {
  const { orderId, customerEmail, customerName, items, subtotal, shipping, total, shippingAddress } = orderDetails;
  
  const formatPrice = (cents: number) => (cents / 100).toLocaleString(undefined, { 
    style: "currency", 
    currency: "USD" 
  });

  const addressString = [
    shippingAddress.line1,
    shippingAddress.line2,
    `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}`,
    shippingAddress.country
  ].filter(Boolean).join('\n');

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: customerEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #8B4513; padding-bottom: 10px;">
            Order Confirmation
          </h1>
          
          <p>Dear ${customerName},</p>
          
          <p>Thank you for your order! We've received your order <strong>${orderId}</strong> and will begin processing it shortly.</p>
          
          <h2 style="color: #8B4513; margin-top: 30px;">Order Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                  <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatPrice(item.price_cents * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #f9f9f9;">
                <td colspan="2" style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Subtotal</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">${formatPrice(subtotal)}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td colspan="2" style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Shipping</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">${formatPrice(shipping)}</td>
              </tr>
              <tr style="background-color: #8B4513; color: white;">
                <td colspan="2" style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Total</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">${formatPrice(total)}</td>
              </tr>
            </tfoot>
          </table>
          
          <h2 style="color: #8B4513; margin-top: 30px;">Shipping Address</h2>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <pre style="margin: 0; font-family: Arial, sans-serif; white-space: pre-line;">${addressString}</pre>
          </div>
          
          <h2 style="color: #8B4513; margin-top: 30px;">What's Next?</h2>
          <p>We'll send you another email once your order has been shipped with tracking information.</p>
          
          <p>If you have any questions about your order, please don't hesitate to contact us at <a href="mailto:stonybendbarn@gmail.com">stonybendbarn@gmail.com</a>.</p>
          
          <p>Thank you for choosing Stony Bend Barn!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            Stony Bend Barn - Handcrafted Woodworking
          </p>
        </div>
      `,
    });
    
    console.log(`✅ Order confirmation email sent to ${customerEmail}`);
  } catch (error) {
    console.error("❌ Failed to send order confirmation email:", error);
    throw error;
  }
}

export async function sendOrderShippedEmail(orderDetails: OrderDetails, trackingNumber?: string) {
  const { orderId, customerEmail, customerName } = orderDetails;
  
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: customerEmail,
      subject: `Your Order Has Shipped - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #8B4513; padding-bottom: 10px;">
            Your Order Has Shipped!
          </h1>
          
          <p>Dear ${customerName},</p>
          
          <p>Great news! Your order <strong>${orderId}</strong> has been shipped and is on its way to you.</p>
          
          ${trackingNumber ? `
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #2d5a2d;">Tracking Information</h3>
              <p style="margin: 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
            </div>
          ` : ''}
          
          <p>You should receive your order within 3-7 business days.</p>
          
          <p>If you have any questions about your shipment, please contact us at <a href="mailto:stonybendbarn@gmail.com">stonybendbarn@gmail.com</a>.</p>
          
          <p>Thank you for your business!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            Stony Bend Barn - Handcrafted Woodworking
          </p>
        </div>
      `,
    });
    
    console.log(`✅ Order shipped email sent to ${customerEmail}`);
  } catch (error) {
    console.error("❌ Failed to send order shipped email:", error);
    throw error;
  }
}

export async function sendAdminOrderNotification(orderDetails: OrderDetails) {
  const { orderId, customerEmail, customerName, items, subtotal, shipping, total, shippingAddress } = orderDetails;
  
  const formatPrice = (cents: number) => (cents / 100).toLocaleString(undefined, { 
    style: "currency", 
    currency: "USD" 
  });

  const addressString = [
    shippingAddress.line1,
    shippingAddress.line2,
    `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}`,
    shippingAddress.country
  ].filter(Boolean).join('\n');

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: process.env.ORDER_EMAIL!,
      subject: `New Order Received - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #8B4513; padding-bottom: 10px;">
            New Order Received
          </h1>
          
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Total:</strong> ${formatPrice(total)}</p>
          
          <h2 style="color: #8B4513; margin-top: 30px;">Items Purchased</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Product ID</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                  <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatPrice(item.price_cents * item.quantity)}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; font-family: monospace;">${item.id}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h2 style="color: #8B4513; margin-top: 30px;">Shipping Address</h2>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <pre style="margin: 0; font-family: Arial, sans-serif; white-space: pre-line;">${addressString}</pre>
          </div>
          
          <p style="margin-top: 30px;">
            <a href="mailto:${customerEmail}" style="background-color: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Reply to Customer
            </a>
          </p>
        </div>
      `,
    });
    
    console.log(`✅ Admin order notification sent for order ${orderId}`);
  } catch (error) {
    console.error("❌ Failed to send admin order notification:", error);
    throw error;
  }
}
