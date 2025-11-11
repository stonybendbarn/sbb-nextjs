// Simple webhook endpoint test (without signature verification)
const https = require('https');

const webhookUrl = 'https://www.stonybendbarn.com/api/stripe-webhook';

// Simple test payload
const testPayload = JSON.stringify({
  type: 'test',
  data: { test: true }
});

console.log('🧪 Testing webhook endpoint accessibility...');
console.log('Webhook URL:', webhookUrl);

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'WebhookTest/1.0'
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
    if (res.statusCode === 400) {
      console.log('✅ Webhook endpoint is accessible (400 is expected without proper signature)');
    } else if (res.statusCode === 200) {
      console.log('✅ Webhook endpoint is working!');
    } else {
      console.log(`❌ Unexpected status: ${res.statusCode}`);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(testPayload);
req.end();











