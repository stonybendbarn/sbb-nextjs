import { Resend } from "resend";

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

export interface ConsolidatedOrderDetails {
  customerEmail: string;
  customerName: string;
  orders: OrderDetails[];
  trackingNumber?: string;
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
    const resend = new Resend(process.env.RESEND_API_KEY);
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
    const resend = new Resend(process.env.RESEND_API_KEY);
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
    const resend = new Resend(process.env.RESEND_API_KEY);
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

export interface TestimonialSubmission {
  customerName: string;
  customerEmail?: string;
  customerLocation?: string;
  testimonialText: string;
  rating: number;
  productName?: string;
  productCategory?: string;
  testimonialId: string;
}

export async function sendAdminTestimonialNotification(testimonial: TestimonialSubmission) {
  const { customerName, customerEmail, customerLocation, testimonialText, rating, productName, productCategory, testimonialId } = testimonial;
  
  // Build product info if available
  let productInfo = "";
  if (productName || productCategory) {
    productInfo = `
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Product Information</h3>
        ${productName ? `<p style="margin: 5px 0;"><strong>Product:</strong> ${productName}</p>` : ''}
        ${productCategory ? `<p style="margin: 5px 0;"><strong>Category:</strong> ${productCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>` : ''}
      </div>
    `;
  }

  // Build customer info
  let customerInfo = `
    <p style="margin: 5px 0;"><strong>Customer:</strong> ${customerName}</p>
  `;
  if (customerLocation) {
    customerInfo += `<p style="margin: 5px 0;"><strong>Location:</strong> ${customerLocation}</p>`;
  }
  if (customerEmail) {
    customerInfo += `<p style="margin: 5px 0;"><strong>Email:</strong> ${customerEmail}</p>`;
  }

  // Build rating display
  const stars = "⭐".repeat(rating);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const recipientEmail = process.env.TESTIMONIAL_EMAIL || process.env.ORDER_EMAIL;
    
    if (!recipientEmail) {
      console.error("❌ TESTIMONIAL_EMAIL or ORDER_EMAIL environment variable not set");
      return;
    }

    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: recipientEmail,
      subject: `New Testimonial Submitted - ${customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #8B4513; padding-bottom: 10px;">
            New Testimonial Submitted
          </h1>
          
          <p>A new testimonial has been submitted and requires your review before being published.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Customer Information</h3>
            ${customerInfo}
          </div>
          
          <div style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Rating</h3>
            <p style="margin: 5px 0; font-size: 18px;">${stars} (${rating}/5)</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Testimonial</h3>
            <p style="margin: 0; font-style: italic; line-height: 1.6;">"${testimonialText}"</p>
          </div>
          
          ${productInfo}
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #1976d2;"><strong>Action Required:</strong> This testimonial requires approval before it will appear on your website.</p>
            <p style="margin: 10px 0 0 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/testimonials" 
                 style="display: inline-block; background-color: #8B4513; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                Review Testimonial
              </a>
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            Testimonial ID: ${testimonialId}<br>
            Stony Bend Barn - Handcrafted Woodworking
          </p>
        </div>
      `,
    });
    
    console.log(`✅ Admin testimonial notification sent to ${recipientEmail}`);
  } catch (error) {
    console.error("❌ Failed to send admin testimonial notification:", error);
    throw error;
  }
}

export async function sendConsolidatedShippingEmail(consolidatedDetails: ConsolidatedOrderDetails) {
  const { customerEmail, customerName, orders, trackingNumber } = consolidatedDetails;
  
  const formatPrice = (cents: number) => (cents / 100).toLocaleString(undefined, { 
    style: "currency", 
    currency: "USD" 
  });

  // Calculate totals across all orders
  const totalSubtotal = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const totalShipping = orders.reduce((sum, order) => sum + order.shipping, 0);
  const grandTotal = totalSubtotal + totalShipping;

  // Get shipping address from first order (should be the same for all)
  const shippingAddress = orders[0].shippingAddress;
  const addressString = [
    shippingAddress.line1,
    shippingAddress.line2,
    `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}`,
    shippingAddress.country
  ].filter(Boolean).join('\n');

  // Build order summary
  const orderSummary = orders.map(order => {
    const itemsList = order.items.map(item => 
      `${item.name}${item.quantity > 1 ? ` (Qty: ${item.quantity})` : ''}`
    ).join(', ');
    
    return `
      <div style="border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px;">
        <h3 style="margin: 0 0 10px 0; color: #8B4513;">Order #${order.orderId}</h3>
        <p style="margin: 5px 0;"><strong>Items:</strong> ${itemsList}</p>
        <p style="margin: 5px 0;"><strong>Subtotal:</strong> ${formatPrice(order.subtotal)}</p>
        <p style="margin: 5px 0;"><strong>Shipping:</strong> ${formatPrice(order.shipping)}</p>
        <p style="margin: 5px 0; font-weight: bold; color: #8B4513;"><strong>Total:</strong> ${formatPrice(order.total)}</p>
      </div>
    `;
  }).join('');

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: customerEmail,
      subject: `Your Orders Have Shipped - ${orders.map(o => o.orderId).join(', ')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #8B4513; padding-bottom: 10px;">
            Your Orders Have Shipped!
          </h1>
          
          <p>Dear ${customerName},</p>
          
          <p>Great news! Your order${orders.length > 1 ? 's have' : ' has'} been shipped and ${orders.length > 1 ? 'are' : 'is'} on ${orders.length > 1 ? 'their' : 'its'} way to you.</p>
          
          ${trackingNumber ? `
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #2d5a2d;">Tracking Information</h3>
              <p style="margin: 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
            </div>
          ` : ''}
          
          <h2 style="color: #8B4513; margin-top: 30px;">Order Details</h2>
          
          ${orderSummary}
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #8B4513;">Order Summary</h3>
            <p style="margin: 5px 0;"><strong>Total Items:</strong> ${orders.length} order${orders.length > 1 ? 's' : ''}</p>
            <p style="margin: 5px 0;"><strong>Total Subtotal:</strong> ${formatPrice(totalSubtotal)}</p>
            <p style="margin: 5px 0;"><strong>Total Shipping:</strong> ${formatPrice(totalShipping)}</p>
            <p style="margin: 5px 0; font-weight: bold; color: #8B4513; font-size: 18px;"><strong>Grand Total:</strong> ${formatPrice(grandTotal)}</p>
          </div>
          
          <h2 style="color: #8B4513; margin-top: 30px;">Shipping Address</h2>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <pre style="margin: 0; font-family: Arial, sans-serif; white-space: pre-line;">${addressString}</pre>
          </div>
          
          <p>You should receive your order${orders.length > 1 ? 's' : ''} within 3-7 business days.</p>
          
          <p>If you have any questions about your shipment${orders.length > 1 ? 's' : ''}, please contact us at <a href="mailto:stonybendbarn@gmail.com">stonybendbarn@gmail.com</a>.</p>
          
          <p>Thank you for your business!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            Stony Bend Barn - Handcrafted Woodworking
          </p>
        </div>
      `,
    });
    
    console.log(`✅ Consolidated shipping email sent to ${customerEmail} for ${orders.length} order(s)`);
  } catch (error) {
    console.error("❌ Failed to send consolidated shipping email:", error);
    throw error;
  }
}
