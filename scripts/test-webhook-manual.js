// Manual webhook test to simulate checkout.session.completed event
const http = require('http');
const crypto = require('crypto');

const webhookSecret = 'whsec_287eeb50a1333e9c00f74ee5d111cea5f853f09be35d3e38618c40c4e77c0aa5';
const webhookUrl = 'http://localhost:3000/api/stripe-webhook';

// Sample checkout.session.completed event
const eventData = {
  id: 'evt_test_webhook',
  object: 'event',
  api_version: '2024-06-20',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'cs_test_manual_webhook',
      object: 'checkout.session',
      amount_total: 5000,
      amount_subtotal: 4500,
      customer_email: 'test@example.com',
      shipping_details: {
        name: 'Test Customer',
        address: {
          line1: '123 Test St',
          city: 'Test City',
          state: 'TS',
          postal_code: '12345',
          country: 'US'
        }
      },
      line_items: {
        data: [{
          id: 'li_test',
          object: 'line_item',
          amount_total: 4500,
          quantity: 1,
          price: {
            product: 'prod_test'
          }
        }]
      }
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_test',
    idempotency_key: null
  },
  type: 'checkout.session.completed'
};

const payload = JSON.stringify(eventData);
const timestamp = Math.floor(Date.now() / 1000);
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(timestamp + '.' + payload)
  .digest('hex');

const stripeSignature = `t=${timestamp},v1=${signature}`;

console.log('🧪 Testing webhook manually...');
console.log('Event type:', eventData.type);
console.log('Customer email:', eventData.data.object.customer_email);

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'stripe-signature': stripeSignature
  }
};

const urlObj = new URL(webhookUrl);
const req = http.request(urlObj, options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('✅ Webhook test successful!');
    } else {
      console.log('❌ Webhook test failed');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(payload);
req.end();
