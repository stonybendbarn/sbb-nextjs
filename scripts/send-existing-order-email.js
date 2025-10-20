const { Resend } = require('resend');
const { sql } = require('@vercel/postgres');

// Load environment variables
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=').trim();
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key.trim()] = value;
    }
  });
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendExistingOrderEmail() {
  try {
    console.log('Fetching orders from database...');
    console.log('Database URL (pooled):', process.env.POSTGRES_DATABASE_URL ? 'Set' : 'Not set');
    console.log('Database URL (unpooled):', process.env.POSTGRES_DATABASE_URL_UNPOOLED ? 'Set' : 'Not set');
    
    // Use unpooled URL for scripts
    if (process.env.POSTGRES_DATABASE_URL_UNPOOLED) {
      process.env.DATABASE_URL = process.env.POSTGRES_DATABASE_URL_UNPOOLED;
    }
    
    // Get all orders
    const { rows: orders } = await sql`
      SELECT id, customer_email, customer_name, subtotal_cents, 
             shipping_cents, total_cents, shipping_address, items, status
      FROM orders
      ORDER BY created_at DESC
    `;
    
    if (orders.length === 0) {
      console.log('No orders found in database.');
      return;
    }
    
    console.log(`Found ${orders.length} orders:`);
    orders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.id} - ${order.customer_name} (${order.customer_email})`);
    });
    
    const formatPrice = (cents) => (cents / 100).toLocaleString(undefined, { 
      style: "currency", 
      currency: "USD" 
    });
    
    // Send email for each order
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      console.log(`\nSending order confirmation email for: ${order.id}`);
      
      const addressString = [
        order.shipping_address.line1,
        order.shipping_address.line2,
        `${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}`,
        order.shipping_address.country
      ].filter(Boolean).join('\n');
    
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: order.customer_email,
      subject: `Order Confirmation - ${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #8B4513; padding-bottom: 10px;">
            Order Confirmation
          </h1>
          
          <p>Dear ${order.customer_name},</p>
          
          <p>Thank you for your order! We've received your order <strong>${order.id}</strong> and will begin processing it shortly.</p>
          
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
              ${order.items.map(item => `
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
                <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">${formatPrice(order.subtotal_cents)}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td colspan="2" style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Shipping</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">${formatPrice(order.shipping_cents)}</td>
              </tr>
              <tr style="background-color: #8B4513; color: white;">
                <td colspan="2" style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Total</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">${formatPrice(order.total_cents)}</td>
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
    
      console.log(`✅ Order confirmation email sent to ${order.customer_email}`);
    }
    
    console.log(`\n✅ All ${orders.length} order confirmation emails sent successfully!`);
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

sendExistingOrderEmail();
