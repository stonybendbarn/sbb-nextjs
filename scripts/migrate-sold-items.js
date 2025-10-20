const { sql } = require('@vercel/postgres');

async function migrateSoldItems() {
  try {
    console.log('Fetching sold items from products table...');
    
    // Get all sold items
    const { rows: soldItems } = await sql`
      SELECT id, name, category, price_cents, sale_price_cents, images
      FROM products 
      WHERE stock_status = 'Sold'
    `;
    
    console.log(`Found ${soldItems.length} sold items`);
    
    for (let i = 0; i < soldItems.length; i++) {
      const item = soldItems[i];
      const effectivePrice = item.sale_price_cents ?? item.price_cents;
      
      // Create a legacy order record
      const orderId = `legacy-order-${item.id}`;
      const items = [{
        id: String(item.id),
        name: item.name,
        price_cents: effectivePrice,
        quantity: 1
      }];
      
      // Estimate shipping based on category
      let shippingCents = 2000; // Default $20
      switch (item.category) {
        case 'cutting-boards': shippingCents = 5000; break;
        case 'cheese-boards': shippingCents = 2500; break;
        case 'coasters': shippingCents = 1200; break;
        case 'bar-ware': shippingCents = 1500; break;
        case 'furniture': shippingCents = 15000; break;
      }
      
      const totalCents = effectivePrice + shippingCents;
      
      await sql`
        INSERT INTO orders (
          id, customer_email, customer_name, subtotal_cents, 
          shipping_cents, total_cents, shipping_address, items, status
        ) VALUES (
          ${orderId},
          'legacy@stonybendbarn.com',
          'Legacy Customer',
          ${effectivePrice},
          ${shippingCents},
          ${totalCents},
          ${JSON.stringify({
            line1: 'Legacy Order',
            city: 'Unknown',
            state: 'Unknown',
            postal_code: '00000',
            country: 'US'
          })},
          ${JSON.stringify(items)},
          'shipped'
        )
        ON CONFLICT (id) DO NOTHING
      `;
      
      console.log(`✅ Created order record for: ${item.name} (ID: ${item.id})`);
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateSoldItems();
