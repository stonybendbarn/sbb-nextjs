// Test Shippo with realistic business requirements
const fs = require('fs');
const path = require('path');

// Load environment variables
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

// Import the shipping class (we'll inline it for now)
const ShippoShipping = require('../lib/shippo-shipping.ts').ShippoShipping;

async function testRealisticShipping() {
  const SHIPPO_API = process.env.SHIPPO_API;
  
  if (!SHIPPO_API) {
    console.error('❌ SHIPPO_API environment variable not found');
    return;
  }

  console.log('🧪 Testing realistic shipping with business requirements...');
  console.log('='.repeat(60));

  const shipping = new ShippoShipping(SHIPPO_API);

  // Test scenarios representing real orders
  const testScenarios = [
    {
      name: "Small Order - Coasters",
      products: [{
        weight_oz: 8,
        length_inches: 4,
        width_inches: 4,
        height_inches: 0.5
      }],
      orderValue: 45,
      customer: {
        name: "Local Customer",
        street1: "123 Main St",
        city: "Raleigh",
        state: "NC",
        zip: "27601"
      }
    },
    {
      name: "Medium Order - Cheese Board",
      products: [{
        weight_oz: 24,
        length_inches: 12,
        width_inches: 8,
        height_inches: 1
      }],
      orderValue: 85,
      customer: {
        name: "Regional Customer",
        street1: "456 Oak Ave",
        city: "Atlanta",
        state: "GA",
        zip: "30309"
      }
    },
    {
      name: "Large Order - Cutting Board",
      products: [{
        weight_oz: 48,
        length_inches: 18,
        width_inches: 12,
        height_inches: 1.5
      }],
      orderValue: 150,
      customer: {
        name: "West Coast Customer",
        street1: "789 Pine St",
        city: "Los Angeles",
        state: "CA",
        zip: "90210"
      }
    },
    {
      name: "Expensive Order - Multiple Items",
      products: [
        {
          weight_oz: 48,
          length_inches: 18,
          width_inches: 12,
          height_inches: 1.5
        },
        {
          weight_oz: 24,
          length_inches: 12,
          width_inches: 8,
          height_inches: 1
        }
      ],
      orderValue: 250,
      customer: {
        name: "East Coast Customer",
        street1: "321 Elm St",
        city: "New York",
        state: "NY",
        zip: "10001"
      }
    }
  ];

  for (const scenario of testScenarios) {
    console.log(`\n📦 ${scenario.name}`);
    console.log(`   Order Value: $${scenario.orderValue}`);
    console.log(`   Customer: ${scenario.customer.name}, ${scenario.customer.city}, ${scenario.customer.state}`);
    
    try {
      const result = await shipping.calculateCombinedShipping(
        scenario.products,
        scenario.customer,
        scenario.orderValue
      );

      console.log(`   ✅ Shipping: $${result.cost.toFixed(2)} (${result.service})`);
      console.log(`   📅 Delivery: ${result.days} days`);
      
      if (result.insurance) {
        console.log(`   🛡️  Insurance: $${result.insurance} (order over $100)`);
      }

      // Calculate total cost breakdown
      const shippingCost = result.cost;
      const insuranceCost = result.insurance ? (result.insurance * 0.01) : 0; // Assume 1% of insured value
      const packagingCost = 3.00; // Your estimated cost for box, peanuts, bubble wrap
      const totalShippingCost = shippingCost + insuranceCost + packagingCost;

      console.log(`   📊 Cost Breakdown:`);
      console.log(`      - Shipping: $${shippingCost.toFixed(2)}`);
      if (insuranceCost > 0) {
        console.log(`      - Insurance: $${insuranceCost.toFixed(2)}`);
      }
      console.log(`      - Packaging: $${packagingCost.toFixed(2)}`);
      console.log(`      - Total Cost: $${totalShippingCost.toFixed(2)}`);

      // Compare to your current system
      const currentRate = shipping.getFallbackShipping('cutting-boards');
      const currentCost = currentRate / 100;
      const savings = currentCost - totalShippingCost;
      
      console.log(`   💰 vs Current System: $${currentCost.toFixed(2)} (${savings > 0 ? 'Save' : 'Cost'}: $${Math.abs(savings).toFixed(2)})`);

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      
      // Show fallback rate
      const fallbackRate = shipping.getFallbackShipping('cutting-boards');
      console.log(`   🔄 Fallback Rate: $${(fallbackRate / 100).toFixed(2)}`);
    }
  }

  console.log('\n🎯 Business Insights:');
  console.log('- Track these costs for a few weeks');
  console.log('- Compare to your current shipping charges');
  console.log('- Adjust your rates based on real data');
  console.log('- Consider insurance costs for expensive orders');
  console.log('- Factor in packaging materials cost');
}

// Run the test
testRealisticShipping();
