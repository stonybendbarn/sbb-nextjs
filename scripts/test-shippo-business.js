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

async function testBusinessShipping() {
  const SHIPPO_API = process.env.SHIPPO_API;
  
  if (!SHIPPO_API) {
    console.error('❌ SHIPPO_API environment variable not found');
    return;
  }

  console.log('🧪 Testing realistic shipping with business requirements...');
  console.log('='.repeat(60));

  // Test scenarios representing real orders
  const testScenarios = [
    {
      name: "Small Order - Coasters ($45)",
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
      name: "Medium Order - Cheese Board ($85)",
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
      name: "Large Order - Cutting Board ($150)",
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
      name: "Expensive Order - Multiple Items ($250)",
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
    console.log(`   Customer: ${scenario.customer.name}, ${scenario.customer.city}, ${scenario.customer.state}`);
    
    try {
      // Calculate combined weight and dimensions
      const totalWeight = scenario.products.reduce((sum, p) => sum + p.weight_oz, 0);
      const maxLength = Math.max(...scenario.products.map(p => p.length_inches));
      const maxWidth = Math.max(...scenario.products.map(p => p.width_inches));
      const totalHeight = scenario.products.reduce((sum, p) => sum + p.height_inches, 0);

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
          name: scenario.customer.name,
          street1: scenario.customer.street1,
          city: scenario.customer.city,
          state: scenario.customer.state,
          zip: scenario.customer.zip,
          country: "US"
        },
        parcels: [{
          length: maxLength.toString(),
          width: maxWidth.toString(),
          height: totalHeight.toString(),
          weight: (totalWeight / 16).toString(),
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
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.rates || data.rates.length === 0) {
        throw new Error('No shipping rates available');
      }

      // Find the best "standard" shipping option
      let bestRate = data.rates.find(rate => 
        rate.servicelevel.name.toLowerCase().includes('ground advantage')
      );
      
      if (!bestRate) {
        bestRate = data.rates.find(rate => 
          rate.servicelevel.name.toLowerCase().includes('priority mail') &&
          !rate.servicelevel.name.toLowerCase().includes('express')
        );
      }
      
      if (!bestRate) {
        bestRate = data.rates.reduce((cheapest, current) => 
          parseFloat(current.amount) < parseFloat(cheapest.amount) ? current : cheapest
        );
      }

      const shippingCost = parseFloat(bestRate.amount);
      
      // Calculate insurance for orders over $100
      let insurance = 0;
      if (scenario.orderValue > 100) {
        insurance = Math.ceil(scenario.orderValue / 100) * 100;
      }

      console.log(`   ✅ Shipping: $${shippingCost.toFixed(2)} (${bestRate.servicelevel.name})`);
      console.log(`   📅 Delivery: ${bestRate.estimated_days} days`);
      
      if (insurance > 0) {
        console.log(`   🛡️  Insurance: $${insurance} (order over $100)`);
      }

      // Calculate total cost breakdown
      const insuranceCost = insurance > 0 ? (insurance * 0.01) : 0; // Assume 1% of insured value
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
      const currentRates = {
        'cutting-boards': 15.00,
        'cheese-boards': 8.00,
        'coasters': 5.00,
        'bar-ware': 6.00,
        'furniture': 25.00
      };
      
      const currentRate = currentRates['cutting-boards']; // Default to cutting board rate
      const savings = currentRate - totalShippingCost;
      
      console.log(`   💰 vs Current System: $${currentRate.toFixed(2)} (${savings > 0 ? 'Save' : 'Cost'}: $${Math.abs(savings).toFixed(2)})`);

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      
      // Show fallback rate
      console.log(`   🔄 Fallback Rate: $15.00 (current system)`);
    }
  }

  console.log('\n🎯 Business Insights:');
  console.log('- Track these costs for a few weeks');
  console.log('- Compare to your current shipping charges');
  console.log('- Adjust your rates based on real data');
  console.log('- Consider insurance costs for expensive orders');
  console.log('- Factor in packaging materials cost');
  console.log('- No free shipping threshold yet - collect data first');
}

// Run the test
testBusinessShipping();
