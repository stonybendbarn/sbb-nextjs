// Test webhook with checkout.session.expired event
const https = require('https');
const crypto = require('crypto');

// You'll need to set this environment variable for testing
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';
const webhookUrl = 'https://www.stonybendbarn.com/api/stripe-webhook';

// Sample checkout.session.expired event
const eventData = {
  id: 'evt_test_expired',
  object: 'event',
  api_version: '2024-06-20',
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: 'cs_test_expired',
      object: 'checkout.session',
      status: 'expired',
      amount_total: 5000,
      amount_subtotal: 4500
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_test',
    idempotency_key: null
  },
  type: 'checkout.session.expired'
};

const payload = JSON.stringify(eventData);
const timestamp = Math.floor(Date.now() / 1000);
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(timestamp + '.' + payload)
  .digest('hex');

const stripeSignature = `t=${timestamp},v1=${signature}`;

console.log('🧪 Testing webhook with expired session event...');
console.log('Event type:', eventData.type);
console.log('Webhook URL:', webhookUrl);

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'stripe-signature': stripeSignature
  }
};

const urlObj = new URL(webhookUrl);
const req = https.request(urlObj, options, (res) => {
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





