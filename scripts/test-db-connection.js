const { sql } = require('@vercel/postgres');

// Load environment variables
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

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    console.log('POSTGRES_DATABASE_URL:', process.env.POSTGRES_DATABASE_URL ? 'Set' : 'Not set');
    console.log('POSTGRES_DATABASE_URL_UNPOOLED:', process.env.POSTGRES_DATABASE_URL_UNPOOLED ? 'Set' : 'Not set');
    
    // Test basic connection
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('Test result:', result);
    
    // Test if orders table exists
    try {
      const orders = await sql`SELECT COUNT(*) as count FROM orders`;
      console.log('✅ Orders table exists!');
      console.log('Number of orders:', orders[0].count);
    } catch (error) {
      console.log('❌ Orders table does not exist or has issues:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testDatabaseConnection();
