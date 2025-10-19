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

console.log('Environment variables check:');
console.log('POSTGRES_DATABASE_URL:', process.env.POSTGRES_DATABASE_URL ? 'Set' : 'Not set');
console.log('POSTGRES_DATABASE_URL_UNPOOLED:', process.env.POSTGRES_DATABASE_URL_UNPOOLED ? 'Set' : 'Not set');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

if (process.env.POSTGRES_DATABASE_URL) {
  console.log('POSTGRES_DATABASE_URL starts with:', process.env.POSTGRES_DATABASE_URL.substring(0, 20) + '...');
}

if (process.env.POSTGRES_DATABASE_URL_UNPOOLED) {
  console.log('POSTGRES_DATABASE_URL_UNPOOLED starts with:', process.env.POSTGRES_DATABASE_URL_UNPOOLED.substring(0, 20) + '...');
}
