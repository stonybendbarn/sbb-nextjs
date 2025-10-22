// Test Shippo API with real sold items and customer addresses
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
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

// Import your database connection
const { sql } = require('@vercel/postgres');

async function testShippoWithRealData() {
  const SHIPPO_API = process.env.SHIPPO_API;
  
  if (!SHIPPO_API) {
    console.error('❌ SHIPPO_API environment variable not found');
    return;
  }

  console.log('🧪 Testing Shippo API with real sold items and customer addresses...');
  console.log('API Key:', SHIPPO_API.substring(0, 8) + '...');

  try {
    // Get sold items from products table
    console.log('\n📦 Fetching sold items from products table...');
    const { rows: soldItems } = await sql`
      SELECT 
        id,
        name,
        category,
        weight_oz,
        length_inches,
        width_inches,
        height_inches,
        shipping_class
      FROM products 
      WHERE stock_status = 'Sold'
      LIMIT 5
    `;

    if (soldItems.length === 0) {
      console.log('❌ No sold items found in products table');
      return;
    }

    console.log(`Found ${soldItems.length} sold items:`);
    soldItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.category})`);
      console.log(`   Dimensions: ${item.length_inches}" x ${item.width_inches}" x ${item.height_inches}"`);
      console.log(`   Weight: ${item.weight_oz} oz`);
    });

    // Get recent orders with shipping addresses
    console.log('\n🏠 Fetching recent orders with shipping addresses...');
    const { rows: orders } = await sql`
      SELECT 
        id,
        customer_name,
        shipping_address,
        items,
        created_at
      FROM orders 
      WHERE shipping_address IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 3
    `;

    if (orders.length === 0) {
      console.log('❌ No orders with shipping addresses found');
      return;
    }

    console.log(`Found ${orders.length} recent orders:`);
    orders.forEach((order, index) => {
      const address = order.shipping_address;
      console.log(`${index + 1}. ${order.customer_name} - ${address.city}, ${address.state} ${address.postal_code}`);
    });

    // Test shipping for each sold item to each customer address
    console.log('\n🚚 Testing shipping rates...');
    console.log('='.repeat(50));

    for (let i = 0; i < Math.min(soldItems.length, 2); i++) {
      const item = soldItems[i];
      console.log(`\n📦 Testing: ${item.name}`);
      console.log(`   Dimensions: ${item.length_inches}" x ${item.width_inches}" x ${item.height_inches}"`);
      console.log(`   Weight: ${item.weight_oz} oz (${(item.weight_oz / 16).toFixed(2)} lbs)`);

      for (let j = 0; j < Math.min(orders.length, 2); j++) {
        const order = orders[j];
        const address = order.shipping_address;
        
        console.log(`\n   🏠 To: ${order.customer_name}, ${address.city}, ${address.state} ${address.postal_code}`);

        try {
          const shippingRequest = {
            address_from: {
              name: "Stony Bend Barn",
              street1: "123 Main St", // You can update this with your real address
              city: "Wake Forest",
              state: "NC",
              zip: "27587",
              country: "US"
            },
            address_to: {
              name: address.name || order.customer_name,
              street1: address.line1 || address.street1,
              city: address.city,
              state: address.state,
              zip: address.postal_code || address.zip,
              country: address.country || "US"
            },
            parcels: [{
              length: item.length_inches.toString(),
              width: item.width_inches.toString(),
              height: item.height_inches.toString(),
              weight: (item.weight_oz / 16).toString(), // Convert oz to lbs
              mass_unit: "lb",
              distance_unit: "in"
            }]
          };

          const response = await fetch('https://api.goshippo.com/shipments/', {
            method: 'POST',
            headers: {
              'Authorization': `ShippoToken ${SHIPPO_API}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(shippingRequest)
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.log(`   ❌ Error: ${response.status} - ${errorText}`);
            continue;
          }

          const data = await response.json();
          
          if (data.rates && data.rates.length > 0) {
            console.log(`   ✅ Shipping options:`);
            data.rates.slice(0, 3).forEach((rate, index) => {
              console.log(`      ${index + 1}. ${rate.servicelevel.name}: $${rate.amount} (${rate.estimated_days} days)`);
            });
          } else {
            console.log(`   ⚠️  No rates returned`);
          }

        } catch (error) {
          console.log(`   ❌ Error calculating rates: ${error.message}`);
        }
      }
    }

    console.log('\n🎉 Real data test completed!');
    console.log('\nThis shows you:');
    console.log('- How your actual products would ship');
    console.log('- Real costs to your actual customers');
    console.log('- Whether your weight/dimension estimates are reasonable');

  } catch (error) {
    console.error('❌ Error testing with real data:', error.message);
  }
}

// Run the test
testShippoWithRealData();
