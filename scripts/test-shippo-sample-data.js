// Test Shippo API with sample data representing typical woodworking products
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

async function testShippoWithSampleData() {
  const SHIPPO_API = process.env.SHIPPO_API;
  
  if (!SHIPPO_API) {
    console.error('❌ SHIPPO_API environment variable not found');
    return;
  }

  console.log('🧪 Testing Shippo API with sample woodworking products...');
  console.log('API Key:', SHIPPO_API.substring(0, 8) + '...');

  // Sample products representing your typical items
  const sampleProducts = [
    {
      name: "Large Cutting Board",
      category: "cutting-boards",
      weight_oz: 48, // 3 lbs
      length_inches: 18,
      width_inches: 12,
      height_inches: 1.5
    },
    {
      name: "Cheese Board",
      category: "cheese-boards", 
      weight_oz: 24, // 1.5 lbs
      length_inches: 12,
      width_inches: 8,
      height_inches: 1
    },
    {
      name: "Coaster Set",
      category: "coasters",
      weight_oz: 8, // 0.5 lbs
      length_inches: 4,
      width_inches: 4,
      height_inches: 0.5
    },
    {
      name: "Barware Set",
      category: "bar-ware",
      weight_oz: 16, // 1 lb
      length_inches: 8,
      width_inches: 6,
      height_inches: 2
    }
  ];

  // Sample customer addresses (representing different regions)
  const sampleAddresses = [
    {
      name: "Local Customer",
      city: "Raleigh",
      state: "NC",
      zip: "27601"
    },
    {
      name: "Regional Customer", 
      city: "Atlanta",
      state: "GA",
      zip: "30309"
    },
    {
      name: "West Coast Customer",
      city: "Los Angeles", 
      state: "CA",
      zip: "90210"
    },
    {
      name: "East Coast Customer",
      city: "New York",
      state: "NY", 
      zip: "10001"
    }
  ];

  console.log('\n📦 Testing with sample products:');
  sampleProducts.forEach((product, index) => {
    console.log(`${index + 1}. ${product.name} (${product.category})`);
    console.log(`   Dimensions: ${product.length_inches}" x ${product.width_inches}" x ${product.height_inches}"`);
    console.log(`   Weight: ${product.weight_oz} oz (${(product.weight_oz / 16).toFixed(2)} lbs)`);
  });

  console.log('\n🏠 Testing with sample addresses:');
  sampleAddresses.forEach((addr, index) => {
    console.log(`${index + 1}. ${addr.name} - ${addr.city}, ${addr.state} ${addr.zip}`);
  });

  console.log('\n🚚 Testing shipping rates...');
  console.log('='.repeat(60));

  for (let i = 0; i < sampleProducts.length; i++) {
    const product = sampleProducts[i];
    console.log(`\n📦 Testing: ${product.name}`);
    console.log(`   Dimensions: ${product.length_inches}" x ${product.width_inches}" x ${product.height_inches}"`);
    console.log(`   Weight: ${product.weight_oz} oz (${(product.weight_oz / 16).toFixed(2)} lbs)`);

    for (let j = 0; j < sampleAddresses.length; j++) {
      const address = sampleAddresses[j];
      
      console.log(`\n   🏠 To: ${address.name}, ${address.city}, ${address.state} ${address.zip}`);

      try {
        const shippingRequest = {
          address_from: {
            name: "Stony Bend Barn",
            street1: "123 Main St",
            city: "Wake Forest",
            state: "NC",
            zip: "27587",
            country: "US"
          },
          address_to: {
            name: address.name,
            street1: "123 Customer St",
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: "US"
          },
          parcels: [{
            length: product.length_inches.toString(),
            width: product.width_inches.toString(),
            height: product.height_inches.toString(),
            weight: (product.weight_oz / 16).toString(),
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
          data.rates.slice(0, 2).forEach((rate, index) => {
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

  console.log('\n🎉 Sample data test completed!');
  console.log('\nKey insights:');
  console.log('- See how different product sizes affect shipping costs');
  console.log('- Compare local vs. distant shipping costs');
  console.log('- Identify which products have high shipping costs');
  console.log('- Plan your free shipping threshold based on real data');
}

// Run the test
testShippoWithSampleData();
