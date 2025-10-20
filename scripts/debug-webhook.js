// Debug script to test webhook functionality
const https = require('https');
const http = require('http');
const { URL } = require('url');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const webhookUrl = `${BASE_URL}/api/stripe-webhook`;

console.log('🔍 Debugging Stripe Webhook...\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing');
console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
console.log('FROM_EMAIL:', process.env.FROM_EMAIL ? '✅ Set' : '❌ Missing');
console.log('ORDER_EMAIL:', process.env.ORDER_EMAIL ? '✅ Set' : '❌ Missing');
console.log('');

// Test webhook endpoint accessibility
console.log('🌐 Testing webhook endpoint accessibility...');
console.log('URL:', webhookUrl);

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'stripe-signature': 'test-signature' // This will fail signature verification, but we can see if endpoint is reachable
  }
};

const urlObj = new URL(webhookUrl);
const client = urlObj.protocol === 'https:' ? https : http;

const req = client.request(urlObj, options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    
    if (res.statusCode === 400 && data.includes('Webhook Error')) {
      console.log('✅ Webhook endpoint is reachable (signature verification failed as expected)');
    } else if (res.statusCode === 200) {
      console.log('✅ Webhook endpoint is working');
    } else {
      console.log('❌ Webhook endpoint may have issues');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error connecting to webhook:', error.message);
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Make sure your dev server is running: npm run dev');
  console.log('2. Check that the webhook URL is correct in Stripe Dashboard');
  console.log('3. Verify your environment variables are set');
});

req.write(JSON.stringify({ test: true }));
req.end();

console.log('\n📝 Next steps:');
console.log('1. Check your Stripe Dashboard webhook logs');
console.log('2. Look at your dev server console for webhook errors');
console.log('3. Verify the webhook is listening for checkout.session.completed events');
