// Test script for the batch shipping notification API
// Using built-in fetch (Node.js 18+) or fallback to https module

const https = require('https');
const http = require('http');
const { URL } = require('url');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Fallback function for older Node.js versions
function makeHttpsRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        // Create a response-like object
        const response = {
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          json: () => Promise.resolve(JSON.parse(responseData))
        };
        resolve(response);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function testBatchShippingAPI() {
  console.log('🧪 Testing Batch Shipping Notification API...\n');

  try {
    // Test data - replace with actual order IDs from your database
    const testData = {
      orderIds: [
        'order-2025-001', // Replace with actual order ID
        'order-2025-002'  // Replace with actual order ID
      ],
      trackingNumber: '1Z437837P220269871'
    };

    console.log('📤 Sending request to batch API...');
    console.log('Order IDs:', testData.orderIds);
    console.log('Tracking Number:', testData.trackingNumber);
    console.log('');

    // Use built-in fetch (Node.js 18+) or fallback
    let response;
    try {
      // Try built-in fetch first (Node.js 18+)
      response = await fetch(`${BASE_URL}/api/send-batch-shipping-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
    } catch (fetchError) {
      // Fallback to https module for older Node.js versions
      console.log('Using https module fallback...');
      response = await makeHttpsRequest(`${BASE_URL}/api/send-batch-shipping-notification`, testData);
    }

    const result = await response.json();

    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ Test passed! Batch shipping notification sent successfully.');
      if (result.results) {
        console.log('\n📊 Results:');
        result.results.forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.message}`);
        });
      }
      if (result.errors && result.errors.length > 0) {
        console.log('\n⚠️  Errors:');
        result.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.customerEmail}: ${error.error}`);
        });
      }
    } else {
      console.log('\n❌ Test failed!');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run the test
testBatchShippingAPI();
