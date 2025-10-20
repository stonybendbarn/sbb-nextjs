// Test script to verify webhook endpoint is accessible
const https = require('https');

const webhookUrl = process.argv[2];
if (!webhookUrl) {
  console.log('Usage: node scripts/test-webhook.js <webhook-url>');
  console.log('Example: node scripts/test-webhook.js https://your-preview-url.vercel.app/api/stripe-webhook');
  process.exit(1);
}

console.log(`Testing webhook endpoint: ${webhookUrl}`);

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'stripe-signature': 'test-signature'
  }
};

const req = https.request(webhookUrl, options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(JSON.stringify({ test: true }));
req.end();


