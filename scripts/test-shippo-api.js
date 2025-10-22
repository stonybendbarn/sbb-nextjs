// Using built-in fetch (Node.js 18+)

// Load environment variables from .env.local manually
const fs = require('fs');
const path = require('path');

// Simple .env.local loader
function loadEnvLocal() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
  } catch (error) {
    console.log('Could not load .env.local file');
  }
}

loadEnvLocal();

// Test script to verify Shippo API is working
async function testShippoAPI() {
  const SHIPPO_API = process.env.SHIPPO_API;
  
  if (!SHIPPO_API) {
    console.error('❌ SHIPPO_API environment variable not found');
    console.log('Make sure you have SHIPPO_API in your .env file');
    return;
  }

  console.log('🧪 Testing Shippo API...');
  console.log('API Key:', SHIPPO_API.substring(0, 8) + '...');

  try {
    // Test with a simple rate request
    const testRequest = {
      address_from: {
        name: "Stony Bend Barn",
        street1: "123 Main St",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        country: "US"
      },
      address_to: {
        name: "Test Customer",
        street1: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zip: "90210",
        country: "US"
      },
      parcels: [{
        length: "12",
        width: "8",
        height: "4",
        weight: "2.5",
        mass_unit: "lb",
        distance_unit: "in"
      }]
    };

    console.log('\n📦 Test package: 12" x 8" x 4", 2.5 lbs');
    console.log('From: Chicago, IL to Los Angeles, CA');

    const response = await fetch('https://api.goshippo.com/shipments/', {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${SHIPPO_API}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API request failed:', response.status, response.statusText);
      console.error('Error details:', errorText);
      return;
    }

    const data = await response.json();
    
    console.log('\n✅ API is working! Here are the shipping options:');
    console.log('=====================================');
    
    if (data.rates && data.rates.length > 0) {
      data.rates.forEach((rate, index) => {
        console.log(`${index + 1}. ${rate.servicelevel.name}`);
        console.log(`   Cost: $${rate.amount} ${rate.currency}`);
        console.log(`   Delivery: ${rate.estimated_days} days`);
        console.log(`   Carrier: ${rate.provider}`);
        console.log('');
      });
    } else {
      console.log('No rates returned - this might be normal for test data');
    }

    console.log('🎉 Shippo API is working correctly!');
    console.log('\nNext steps:');
    console.log('1. Integrate this into your checkout process');
    console.log('2. Replace your current shipping calculation');
    console.log('3. Test with real customer addresses');

  } catch (error) {
    console.error('❌ Error testing Shippo API:', error.message);
    console.log('\nTroubleshooting:');
    console.log('- Check your SHIPPO_API_KEY is correct');
    console.log('- Verify your Shippo account is active');
    console.log('- Check your internet connection');
  }
}

// Run the test
testShippoAPI();
