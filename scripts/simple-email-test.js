const { Resend } = require('resend');

// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');

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

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error('❌ RESEND_API_KEY environment variable is not set!');
  process.exit(1);
}

const resend = new Resend(apiKey);

async function sendSimpleTest() {
  try {
    console.log('API Key:', apiKey.substring(0, 10) + '...');
    console.log('From:', process.env.FROM_EMAIL);
    console.log('To:', process.env.ORDER_EMAIL);
    
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.ORDER_EMAIL,
      subject: 'Simple Test Email',
      text: 'This is a simple test email to verify the system is working.',
    });
    
    console.log('✅ Simple test email sent!');
    console.log('Full result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    console.error('Error details:', error.message);
  }
}

sendSimpleTest();
