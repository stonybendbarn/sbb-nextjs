const { Resend } = require('resend');

// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');

// Try to load .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error('❌ RESEND_API_KEY environment variable is not set!');
  console.error('Please set it in your .env.local file or run with:');
  console.error('RESEND_API_KEY=your_key node scripts/test-email.js');
  process.exit(1);
}

const resend = new Resend(apiKey);

async function sendTestEmail() {
  try {
    console.log('Sending test email...');
    console.log('From:', process.env.FROM_EMAIL);
    console.log('To:', process.env.ORDER_EMAIL);
    
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.ORDER_EMAIL, // Send to your admin email
      subject: 'Test Email - Order System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #8B4513; padding-bottom: 10px;">
            Test Email - Order System
          </h1>
          
          <p>Hello!</p>
          
          <p>This is a test email to confirm that your order management email system is working correctly.</p>
          
          <h2 style="color: #8B4513; margin-top: 30px;">Test Order Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Test Cutting Board</td>
                <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">1</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$250.00</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Test Coasters (On Sale)</td>
                <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">1</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$18.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr style="background-color: #f9f9f9;">
                <td colspan="2" style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Subtotal</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">$268.00</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td colspan="2" style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Shipping</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">$15.00</td>
              </tr>
              <tr style="background-color: #8B4513; color: white;">
                <td colspan="2" style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Total</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">$283.00</td>
              </tr>
            </tfoot>
          </table>
          
          <h2 style="color: #8B4513; margin-top: 30px;">Shipping Address</h2>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <pre style="margin: 0; font-family: Arial, sans-serif; white-space: pre-line;">123 Test Street
Test City, TS 12345
United States</pre>
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
    
    console.log('✅ Test email sent successfully!');
    console.log('Email ID:', result.data?.id);
    console.log('Check your inbox at:', process.env.ORDER_EMAIL);
    
  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    console.error('Error details:', error.message);
  }
}

sendTestEmail();
