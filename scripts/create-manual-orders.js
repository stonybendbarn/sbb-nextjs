const { sql } = require('@vercel/postgres');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createManualOrders() {
  try {
    console.log('Let\'s create order records for your 2 sold items...\n');
    
    // Get sold items
    const { rows: soldItems } = await sql`
      SELECT id, name, category, price_cents, sale_price_cents
      FROM products 
      WHERE stock_status = 'Sold'
      ORDER BY id
    `;
    
    console.log('Found these sold items:');
    soldItems.forEach((item, index) => {
      const price = item.sale_price_cents ?? item.price_cents;
      console.log(`${index + 1}. ${item.name} - $${(price / 100).toFixed(2)} (ID: ${item.id})`);
    });
    
    console.log('\nNow let\'s create order records for each item:\n');
    
    for (let i = 0; i < soldItems.length; i++) {
      const item = soldItems[i];
      const effectivePrice = item.sale_price_cents ?? item.price_cents;
      
      console.log(`\n--- Order ${i + 1}: ${item.name} ---`);
      
      const orderId = await question('Order ID (e.g., order-2024-001): ');
      const customerEmail = await question('Customer email: ');
      const customerName = await question('Customer name: ');
      const shippingCents = await question(`Shipping cost in cents (current: ${Math.round(effectivePrice * 0.1)}): `) || Math.round(effectivePrice * 0.1);
      const status = await question('Status (pending/shipped) [shipped]: ') || 'shipped';
      
      console.log('\nShipping address:');
      const line1 = await question('Address line 1: ');
      const city = await question('City: ');
      const state = await question('State: ');
      const postalCode = await question('Postal code: ');
      const country = await question('Country [US]: ') || 'US';
      
      const totalCents = effectivePrice + parseInt(shippingCents);
      
      const orderData = {
        id: orderId,
        customer_email: customerEmail,
        customer_name: customerName,
        subtotal_cents: effectivePrice,
        shipping_cents: parseInt(shippingCents),
        total_cents: totalCents,
        shipping_address: {
          line1,
          city,
          state,
          postal_code: postalCode,
          country
        },
        items: [{
          id: String(item.id),
          name: item.name,
          price_cents: effectivePrice,
          quantity: 1
        }],
        status
      };
      
      await sql`
        INSERT INTO orders (
          id, customer_email, customer_name, subtotal_cents, 
          shipping_cents, total_cents, shipping_address, items, status
        ) VALUES (
          ${orderData.id},
          ${orderData.customer_email},
          ${orderData.customer_name},
          ${orderData.subtotal_cents},
          ${orderData.shipping_cents},
          ${orderData.total_cents},
          ${JSON.stringify(orderData.shipping_address)},
          ${JSON.stringify(orderData.items)},
          ${orderData.status}
        )
      `;
      
      console.log(`✅ Order ${orderId} created successfully!`);
    }
    
    console.log('\n✅ All orders created successfully!');
  } catch (error) {
    console.error('❌ Error creating orders:', error);
  } finally {
    rl.close();
  }
}

createManualOrders();
